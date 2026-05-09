const express = require('express');
const router = express.Router();
const { registerUser, loginUser, uploadAvatar, updateUserProfile, forgotPassword, verifyOTP, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.put('/profile', protect, updateUserProfile);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

module.exports = router;
