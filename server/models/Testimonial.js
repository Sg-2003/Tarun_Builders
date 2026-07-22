const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: String,
  organization: String,
  project: String,
  message: { type: String, required: true },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  photo: String,
  isApproved: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
