const express = require('express');
const router = express.Router();
const { getNews, getNewsItem, createNews, updateNews, deleteNews } = require('../controllers/newsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', getNews);
router.get('/:id', getNewsItem);
router.post('/', protect, adminOnly, upload.single('image'), createNews);
router.put('/:id', protect, adminOnly, upload.single('image'), updateNews);
router.delete('/:id', protect, adminOnly, deleteNews);

module.exports = router;
