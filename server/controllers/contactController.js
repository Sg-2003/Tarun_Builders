const Contact = require('../models/Contact');

const submitContact = async (req, res) => {
  try {
    const { name, email, phone, organization, subject, department, message, type } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ success: false, message: 'Name, email and message are required' });
    const contact = await Contact.create({ name, email, phone, organization, subject, department, message, type: type || 'General', ipAddress: req.ip });
    res.status(201).json({ success: true, message: 'Your message has been submitted successfully. We will contact you soon!', data: contact });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const getContacts = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    const unread = await Contact.countDocuments({ isRead: false });
    res.json({ success: true, total, unread, data: contacts });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { ...req.body, isRead: true }, { new: true });
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, data: contact });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

module.exports = { submitContact, getContacts, updateContact, deleteContact };
