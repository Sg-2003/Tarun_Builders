const express = require('express');
const router = express.Router();
const { getCareers, getCareer, createCareer, updateCareer, deleteCareer, applyForCareer } = require('../controllers/careerController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', getCareers);
router.get('/:id', getCareer);
router.post('/', protect, adminOnly, createCareer);
router.post('/:id/apply', upload.single('resume'), applyForCareer);
router.put('/:id', protect, adminOnly, updateCareer);
router.delete('/:id', protect, adminOnly, deleteCareer);

module.exports = router;
