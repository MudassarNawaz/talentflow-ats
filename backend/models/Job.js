const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: [true, 'Branch is required'],
  },
  seats: {
    type: Number,
    required: [true, 'Number of seats is required'],
    min: 1,
  },
  requirements: [{
    type: String,
    trim: true,
  }],
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'PKR' },
  },
  type: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Remote'],
    default: 'Full-Time',
  },
  experience: {
    type: String,
    default: 'Entry Level',
  },
  status: {
    type: String,
    enum: ['Open', 'Closed', 'Draft'],
    default: 'Open',
  },
  deadline: {
    type: Date,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  applicationsCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Text index for search
jobSchema.index({ title: 'text', description: 'text', department: 'text' });

module.exports = mongoose.model('Job', jobSchema);
