const Department = require('../models/Department');

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true }).populate('head', 'name designation avatar').sort({ order: 1 });
    res.json({ success: true, data: departments });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const getDepartment = async (req, res) => {
  try {
    const dept = await Department.findById(req.params.id).populate('head', 'name designation avatar').populate('employees', 'name designation');
    if (!dept) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: dept });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const createDepartment = async (req, res) => {
  try {
    const dept = await Department.create(req.body);
    res.status(201).json({ success: true, data: dept });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

const updateDepartment = async (req, res) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!dept) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: dept });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

const deleteDepartment = async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

module.exports = { getDepartments, getDepartment, createDepartment, updateDepartment, deleteDepartment };
