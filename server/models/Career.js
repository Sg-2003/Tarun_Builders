const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: String,
  location: String,
  type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], default: 'Full-time' },
  experience: String,
  qualification: String,
  salary: String,
  vacancies: { type: Number, default: 1 },
  description: String,
  responsibilities: [String],
  requirements: [String],
  lastDate: Date,
  isActive: { type: Boolean, default: true },
  applications: [{
    name: String,
    email: String,
    phone: String,
    resumeUrl: String,
    coverLetter: String,
    appliedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'], default: 'Applied' }
  }],
}, { timestamps: true });

module.exports = mongoose.model('Career', careerSchema);
