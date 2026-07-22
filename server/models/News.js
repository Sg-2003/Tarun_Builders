const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  content: String,
  excerpt: String,
  category: { type: String, enum: ['Announcement', 'PressRelease', 'GovtNotification', 'MediaCoverage', 'Award', 'Event'], default: 'Announcement' },
  image: { url: String, publicId: String },
  tags: [String],
  source: String,
  isPublished: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  publishedAt: Date,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  views: { type: Number, default: 0 },
  attachments: [{ name: String, url: String }],
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
