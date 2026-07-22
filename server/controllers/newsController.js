const News = require('../models/News');
const slugify = require('slugify');

const getNews = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await News.countDocuments(query);
    const news = await News.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    res.json({ success: true, total, data: news });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const getNewsItem = async (req, res) => {
  try {
    const item = await News.findOne({ $or: [{ _id: req.params.id }, { slug: req.params.id }] });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    item.views = (item.views || 0) + 1;
    await item.save({ validateBeforeSave: false });
    res.json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const createNews = async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.title) body.slug = slugify(body.title, { lower: true, strict: true }) + '-' + Date.now();
    if (req.file) body.image = { url: req.file.path, publicId: req.file.filename };
    body.author = req.user._id;
    body.publishedAt = new Date();
    const news = await News.create(body);
    res.status(201).json({ success: true, data: news });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

const updateNews = async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.file) body.image = { url: req.file.path, publicId: req.file.filename };
    const news = await News.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!news) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: news });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

const deleteNews = async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

module.exports = { getNews, getNewsItem, createNews, updateNews, deleteNews };
