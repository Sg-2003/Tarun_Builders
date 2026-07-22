const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  organization: String,
  subject: String,
  department: String,
  message: { type: String, required: true },
  type: { type: String, enum: ['General', 'Project', 'Tender', 'Career', 'RTI', 'Grievance'], default: 'General' },
  status: { type: String, enum: ['New', 'InProgress', 'Resolved', 'Closed'], default: 'New' },
  isRead: { type: Boolean, default: false },
  adminNotes: String,
  repliedAt: Date,
  repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ipAddress: String,
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
