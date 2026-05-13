const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { sendEmail, emailTemplates } = require('../utils/emailService');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Candidate)
exports.applyForJob = async (req, res, next) => {
  try {
    const { jobId, coverLetterUrl } = req.body;

    // Check if job exists and is open
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    if (job.status !== 'Open') {
      return res.status(400).json({ success: false, message: 'This job is no longer accepting applications' });
    }

    // Check if already applied
    const existing = await Application.findOne({ job: jobId, candidate: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }

    // Get resume URL
    let resumeUrl = req.user.resumeUrl;
    if (req.file) {
      resumeUrl = req.file.path;
    }
    if (!resumeUrl) {
      return res.status(400).json({ success: false, message: 'Please upload a resume before applying' });
    }

    const application = await Application.create({
      job: jobId,
      candidate: req.user._id,
      resumeUrl,
      coverLetterUrl: coverLetterUrl || '',
    });

    // Increment application count on job
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } });

    await application.populate('job', 'title');

    res.status(201).json({
      success: true,
      application,
      message: 'Application submitted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate's applications
// @route   GET /api/applications/my
// @access  Private (Candidate)
exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate({
        path: 'job',
        populate: { path: 'branch', select: 'name city' },
      })
      .sort('-createdAt');

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications (HR/Admin)
// @route   GET /api/applications
// @access  Private (HR/Admin)
exports.getAllApplications = async (req, res, next) => {
  try {
    const { job, status, search } = req.query;
    const query = {};

    if (job) query.job = job;
    if (status) query.status = status;

    let applications = await Application.find(query)
      .populate('candidate', 'name email phone profilePicture skills headline')
      .populate({
        path: 'job',
        populate: { path: 'branch', select: 'name city' },
      })
      .sort('-createdAt');

    // Filter by candidate name/email if search is provided
    if (search) {
      applications = applications.filter(app =>
        app.candidate.name.toLowerCase().includes(search.toLowerCase()) ||
        app.candidate.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
exports.getApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('candidate', 'name email phone profilePicture skills headline experience education resumeUrl')
      .populate({
        path: 'job',
        populate: { path: 'branch', select: 'name city address' },
      });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Candidates can only see their own applications
    if (req.user.role === 'candidate' && application.candidate._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (HR/Admin)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    const application = await Application.findById(req.params.id)
      .populate('candidate', 'name email')
      .populate('job', 'title');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = status;
    if (notes) application.hrNotes = notes;
    await application.save();

    // Send email notification based on status in the background
    let emailData;
    switch (status) {
      case 'Shortlisted':
        emailData = emailTemplates.shortlisted(application.candidate.name, application.job.title);
        break;
      case 'Rejected':
        emailData = emailTemplates.rejection(application.candidate.name, application.job.title);
        break;
      case 'Selected':
        emailData = emailTemplates.selected(application.candidate.name, application.job.title);
        break;
    }

    if (emailData) {
      sendEmail({
        to: application.candidate.email,
        ...emailData,
      }).catch(emailErr => {
        console.log('Email notification failed (non-critical):', emailErr.message);
      });
    }

    res.json({
      success: true,
      application,
      message: `Application status updated to "${status}"`,
    });
  } catch (error) {
    next(error);
  }
};
