const { sendEmail, emailTemplates } = require('../utils/emailService');
const User = require('../models/User');

// @desc    Send custom email
// @route   POST /api/email/send
// @access  Private (HR/Admin)
exports.sendCustomEmail = async (req, res, next) => {
  try {
    const { to, candidateId, subject, message } = req.body;

    let recipientEmail = to;
    let candidateName = 'Candidate';

    if (candidateId) {
      const candidate = await User.findById(candidateId);
      if (candidate) {
        recipientEmail = candidate.email;
        candidateName = candidate.name;
      }
    }

    if (!recipientEmail) {
      return res.status(400).json({ success: false, message: 'Recipient email required' });
    }

    const emailData = emailTemplates.custom(candidateName, subject, message);
    const result = await sendEmail({ to: recipientEmail, ...emailData });

    if (result.success) {
      res.json({ success: true, message: 'Email sent successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send email', error: result.error });
    }
  } catch (error) {
    next(error);
  }
};
