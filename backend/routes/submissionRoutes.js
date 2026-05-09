const express = require('express');
const router = express.Router();
const { submitAssessment, getMySubmissions, getMyStats, getAllSubmissions, gradeSubmission } = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitAssessment);
router.get('/my', protect, getMySubmissions);
router.get('/stats', protect, getMyStats);
router.get('/all', protect, getAllSubmissions);
router.patch('/:id/grade', protect, gradeSubmission);

module.exports = router;
