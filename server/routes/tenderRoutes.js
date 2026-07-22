const express = require('express');
const router = express.Router();
const { getTenders, getTender, createTender, updateTender, deleteTender } = require('../controllers/tenderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', getTenders);
router.get('/:id', getTender);
router.post('/', protect, adminOnly, upload.array('documents', 5), createTender);
router.put('/:id', protect, adminOnly, updateTender);
router.delete('/:id', protect, adminOnly, deleteTender);

module.exports = router;
