const express = require('express');
const router = express.Router();
const { getAllUsers, getAllSubmissionsAdmin, getAdminStats } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.get('/users', protect, getAllUsers);
router.get('/submissions', protect, getAllSubmissionsAdmin);
router.get('/stats', protect, getAdminStats);

module.exports = router;
