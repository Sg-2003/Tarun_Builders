const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  caption: String,
  type: { type: String, enum: ['image', 'video', 'drone', '360'], default: 'image' },
  url: { type: String, required: true },
  publicId: String,
  thumbnail: String,
  category: { type: String, enum: ['Projects', 'Office', 'Events', 'Awards', 'Construction', 'Completed'], default: 'Projects' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  tags: [String],
  isPublished: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
