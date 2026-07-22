const express = require('express');
const router = express.Router();
const { login, getMe, refreshToken } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/refresh', refreshToken);

module.exports = router;
