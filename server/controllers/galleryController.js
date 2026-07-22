const Gallery = require('../models/Gallery');

const getGallery = async (req, res) => {
  try {
    const { category, type, page = 1, limit = 20 } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;
    if (type) query.type = type;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Gallery.countDocuments(query);
    const items = await Gallery.find(query).sort({ order: 1, createdAt: -1 }).skip(skip).limit(parseInt(limit));
    res.json({ success: true, total, data: items });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const addGalleryItem = async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.file) { body.url = req.file.path; body.publicId = req.file.filename; }
    const item = await Gallery.create(body);
    res.status(201).json({ success: true, data: item });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

const updateGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

const deleteGalleryItem = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

module.exports = { getGallery, addGalleryItem, updateGalleryItem, deleteGalleryItem };
