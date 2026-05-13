const Interview = require('../models/Interview');
const Application = require('../models/Application');
const User = require('../models/User');
const { sendEmail, emailTemplates } = require('../utils/emailService');

// @desc    Schedule an interview
// @route   POST /api/interviews
// @access  Private (HR/Admin)
exports.createInterview = async (req, res, next) => {
  try {
    const { applicationId, scheduledDate, scheduledTime, duration, type, location, message } = req.body;

    const application = await Application.findById(applicationId)
      .populate('candidate', 'name email')
      .populate('job', 'title');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const interview = await Interview.create({
      application: applicationId,
      candidate: application.candidate._id,
      job: application.job._id,
      scheduledDate,
      scheduledTime,
      duration: duration || 60,
      type: type || 'In-Person',
      location: location || '',
      message: message || '',
      createdBy: req.user._id,
    });

    // Update application status
    application.status = 'Interview Scheduled';
    await application.save();

    // Send interview invitation email
    try {
      const dateStr = new Date(scheduledDate).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      });
      const emailData = emailTemplates.interviewInvitation(
        application.candidate.name,
        application.job.title,
        dateStr,
        scheduledTime,
        message
      );
      await sendEmail({
        to: application.candidate.email,
        ...emailData,
      });
    } catch (emailErr) {
      console.log('Interview email failed (non-critical):', emailErr.message);
    }

    await interview.populate('candidate', 'name email phone');
    await interview.populate('job', 'title');

    res.status(201).json({
      success: true,
      interview,
      message: 'Interview scheduled successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all interviews
// @route   GET /api/interviews
// @access  Private (HR/Admin)
exports.getInterviews = async (req, res, next) => {
  try {
    const { status, date } = req.query;
    const query = {};

    if (status) query.status = status;
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.scheduledDate = { $gte: startOfDay, $lte: endOfDay };
    }

    const interviews = await Interview.find(query)
      .populate('candidate', 'name email phone profilePicture')
      .populate('job', 'title department')
      .populate('createdBy', 'name')
      .sort('scheduledDate scheduledTime');

    res.json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate's interviews
// @route   GET /api/interviews/my
// @access  Private (Candidate)
exports.getMyInterviews = async (req, res, next) => {
  try {
    const interviews = await Interview.find({ candidate: req.user._id })
      .populate('job', 'title department')
      .sort('-scheduledDate');

    res.json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update interview
// @route   PUT /api/interviews/:id
// @access  Private (HR/Admin)
exports.updateInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('candidate', 'name email phone')
      .populate('job', 'title');

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    res.json({ success: true, interview });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete interview
// @route   DELETE /api/interviews/:id
// @access  Private (HR/Admin)
exports.deleteInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.id);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }
    res.json({ success: true, message: 'Interview deleted' });
  } catch (error) {
    next(error);
  }
};
