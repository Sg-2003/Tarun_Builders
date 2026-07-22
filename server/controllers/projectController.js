const Project = require('../models/Project');
const slugify = require('slugify');

const getProjects = async (req, res) => {
  try {
    const { category, status, featured, page = 1, limit = 12 } = req.query;
    const query = { isVisible: true };
    if (category) query.category = category;
    if (status) query.status = status;
    if (featured === 'true') query.isFeatured = true;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .populate('department', 'name')
      .populate('engineer', 'name designation')
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip).limit(parseInt(limit));
    res.json({ success: true, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), data: projects });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({ $or: [{ _id: req.params.id }, { slug: req.params.id }] })
      .populate('department', 'name code').populate('engineer', 'name designation avatar');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    project.views = (project.views || 0) + 1;
    await project.save({ validateBeforeSave: false });
    res.json({ success: true, data: project });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const createProject = async (req, res) => {
  try {
    const body = req.body;
    if (body.title) body.slug = slugify(body.title, { lower: true, strict: true }) + '-' + Date.now();
    if (req.files?.length) {
      body.images = req.files.map((f, i) => ({ url: f.path, publicId: f.filename, isMain: i === 0 }));
    }
    const project = await Project.create(body);
    res.status(201).json({ success: true, data: project });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

const updateProject = async (req, res) => {
  try {
    const body = req.body;
    if (req.files?.length) {
      body.images = req.files.map((f, i) => ({ url: f.path, publicId: f.filename, isMain: i === 0 }));
    }
    const project = await Project.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const getStats = async () => {
  const total = await Project.countDocuments();
  const completed = await Project.countDocuments({ status: 'Completed' });
  const running = await Project.countDocuments({ status: 'Running' });
  return { total, completed, running };
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject, getStats };
