const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get all jobs (public)
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
  try {
    const { branch, department, type, search, status, page = 1, limit = 12 } = req.query;
    const query = {};

    // Public users only see open jobs
    if (!req.user || req.user.role === 'candidate') {
      query.status = 'Open';
    } else if (status) {
      query.status = status;
    }

    if (branch) query.branch = branch;
    if (department) query.department = { $regex: department, $options: 'i' };
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('branch', 'name city')
      .populate('postedBy', 'name')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('branch', 'name city address')
      .populate('postedBy', 'name email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (HR/Admin)
exports.createJob = async (req, res, next) => {
  try {
    req.body.postedBy = req.user._id;

    // Parse requirements if it's a string
    if (typeof req.body.requirements === 'string') {
      req.body.requirements = req.body.requirements.split(',').map(r => r.trim());
    }

    const job = await Job.create(req.body);
    await job.populate('branch', 'name city');

    res.status(201).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (HR/Admin)
exports.updateJob = async (req, res, next) => {
  try {
    if (typeof req.body.requirements === 'string') {
      req.body.requirements = req.body.requirements.split(',').map(r => r.trim());
    }

    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('branch', 'name city');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (HR/Admin)
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Delete associated applications
    await Application.deleteMany({ job: req.params.id });
    await Job.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Job and associated applications deleted',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get job statistics
// @route   GET /api/jobs/stats/overview
// @access  Private (HR/Admin)
exports.getJobStats = async (req, res, next) => {
  try {
    const totalJobs = await Job.countDocuments();
    const openJobs = await Job.countDocuments({ status: 'Open' });
    const closedJobs = await Job.countDocuments({ status: 'Closed' });

    const totalApplications = await Application.countDocuments();
    const statusCounts = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const departmentStats = await Job.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const branchStats = await Job.aggregate([
      { $lookup: { from: 'branches', localField: 'branch', foreignField: '_id', as: 'branchInfo' } },
      { $unwind: '$branchInfo' },
      { $group: { _id: '$branchInfo.name', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const monthlyApplications = await Application.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);

    res.json({
      success: true,
      stats: {
        totalJobs,
        openJobs,
        closedJobs,
        totalApplications,
        statusCounts: statusCounts.reduce((acc, s) => { acc[s._id] = s.count; return acc; }, {}),
        departmentStats,
        branchStats,
        monthlyApplications,
      },
    });
  } catch (error) {
    next(error);
  }
};
