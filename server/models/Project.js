const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  shortDescription: String,
  category: {
    type: String,
    enum: ['Residential', 'Commercial', 'Government', 'Road', 'Bridge', 'Railway', 'Metro', 'Airport', 'Industrial', 'SmartCity', 'Renovation', 'PMC'],
    required: true
  },
  status: { type: String, enum: ['Upcoming', 'Running', 'Completed', 'OnHold'], default: 'Running' },
  location: { type: String, required: true },
  state: String,
  clientName: String,
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  engineer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  budget: { type: String },
  budgetValue: Number,
  area: String,
  duration: String,
  startDate: Date,
  expectedEndDate: Date,
  completionDate: Date,
  progress: { type: Number, default: 0, min: 0, max: 100 },
  images: [{ url: String, publicId: String, caption: String, isMain: { type: Boolean, default: false } }],
  features: [String],
  isFeatured: { type: Boolean, default: false },
  isVisible: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  governmentOrderNo: String,
  tenderNo: String,
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
