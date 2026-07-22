const Career = require('../models/Career');

const getCareers = async (req, res) => {
  try {
    const careers = await Career.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: careers });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const getCareer = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: career });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const createCareer = async (req, res) => {
  try {
    const career = await Career.create(req.body);
    res.status(201).json({ success: true, data: career });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

const updateCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!career) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: career });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

const deleteCareer = async (req, res) => {
  try {
    await Career.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const applyForCareer = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career || !career.isActive)
      return res.status(404).json({ success: false, message: 'Position not found or closed' });
    const { name, email, phone, coverLetter } = req.body;
    const application = { name, email, phone, coverLetter };
    if (req.file) application.resumeUrl = req.file.path;
    career.applications.push(application);
    await career.save();
    res.status(201).json({ success: true, message: 'Application submitted successfully!' });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

module.exports = { getCareers, getCareer, createCareer, updateCareer, deleteCareer, applyForCareer };
