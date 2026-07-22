const express = require('express');
const router = express.Router();
const { getGallery, addGalleryItem, updateGalleryItem, deleteGalleryItem } = require('../controllers/galleryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', getGallery);
router.post('/', protect, adminOnly, upload.single('file'), addGalleryItem);
router.put('/:id', protect, adminOnly, updateGalleryItem);
router.delete('/:id', protect, adminOnly, deleteGalleryItem);

module.exports = router;
