const express = require('express');
const router = express.Router();
const { submitContact, getContacts, updateContact, deleteContact } = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', submitContact);
router.get('/', protect, adminOnly, getContacts);
router.put('/:id', protect, adminOnly, updateContact);
router.delete('/:id', protect, adminOnly, deleteContact);

module.exports = router;
