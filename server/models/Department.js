const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, unique: true },
  description: String,
  head: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  headName: String,
  headDesignation: String,
  headPhoto: String,
  icon: String,
  color: String,
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  services: [String],
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);
