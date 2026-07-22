const mongoose = require('mongoose');

const tenderSchema = new mongoose.Schema({
  tenderNo: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  departmentName: String,
  category: { type: String, enum: ['Works', 'Goods', 'Services', 'Consultancy'], default: 'Works' },
  estimatedValue: String,
  bidSubmissionDate: { type: Date, required: true },
  openingDate: Date,
  documentDownloadFrom: Date,
  documentDownloadTo: Date,
  status: { type: String, enum: ['Active', 'Closed', 'Awarded', 'Cancelled', 'Extended'], default: 'Active' },
  documents: [{ name: String, url: String, publicId: String, size: String }],
  corrigendum: [{ title: String, date: Date, url: String }],
  isPublished: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  location: String,
  state: String,
}, { timestamps: true });

module.exports = mongoose.model('Tender', tenderSchema);
