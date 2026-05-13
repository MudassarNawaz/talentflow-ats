const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Interview date is required'],
  },
  scheduledTime: {
    type: String,
    required: [true, 'Interview time is required'],
  },
  duration: {
    type: Number, // minutes
    default: 60,
  },
  type: {
    type: String,
    enum: ['In-Person', 'Video Call', 'Phone'],
    default: 'In-Person',
  },
  location: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'],
    default: 'Scheduled',
  },
  feedback: {
    type: String,
    default: '',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Interview', interviewSchema);
