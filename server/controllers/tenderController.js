const Tender = require('../models/Tender');

const getTenders = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    const query = { isPublished: true };
    if (status) query.status = status;
    if (category) query.category = category;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Tender.countDocuments(query);
    const tenders = await Tender.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    res.json({ success: true, total, data: tenders });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const getTender = async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id).populate('department', 'name');
    if (!tender) return res.status(404).json({ success: false, message: 'Tender not found' });
    tender.views = (tender.views || 0) + 1;
    await tender.save({ validateBeforeSave: false });
    res.json({ success: true, data: tender });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const createTender = async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.files?.length) {
      body.documents = req.files.map(f => ({ name: f.originalname, url: f.path, publicId: f.filename }));
    }
    const tender = await Tender.create(body);
    res.status(201).json({ success: true, data: tender });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

const updateTender = async (req, res) => {
  try {
    const tender = await Tender.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tender) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: tender });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

const deleteTender = async (req, res) => {
  try {
    await Tender.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

module.exports = { getTenders, getTender, createTender, updateTender, deleteTender };
