const express = require('express');
const router = express.Router();
const { getAssessments, getAssessmentById, createAssessment, updateAssessment, deleteAssessment } = require('../controllers/assessmentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAssessments);
router.get('/:id', protect, getAssessmentById);
router.post('/', protect, createAssessment);
router.put('/:id', protect, updateAssessment);
router.delete('/:id', protect, deleteAssessment);

module.exports = router;
