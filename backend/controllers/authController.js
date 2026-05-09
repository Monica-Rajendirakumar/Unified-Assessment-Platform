const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { asyncHandler, ErrorResponse } = require('../middleware/errorMiddleware');
const { sendOTPEmail } = require('../utils/emailService');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, instituteCode } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ErrorResponse('User already exists', 400));
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'Student',
    instituteCode
  });

  res.status(201).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role, user.name),
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password, role } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    // Verify role if provided
    if (role && user.role !== role) {
      return next(new ErrorResponse(`Invalid credentials. You do not have the ${role} role.`, 401));
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user._id, user.role, user.name),
    });
  } else {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
});

// @desc    Upload Profile Avatar
// @route   POST /api/auth/avatar
// @access  Private
const uploadAvatar = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Update user with new avatar path
  user.avatar = `/uploads/${req.file.filename}`;
  await user.save();

  res.json({
    success: true,
    avatar: user.avatar,
    message: 'Profile image updated successfully'
  });
});

// @desc    Update User Profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.location = req.body.location !== undefined ? req.body.location : user.location;
    
    // Only update password if provided
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      bio: updatedUser.bio,
      location: updatedUser.location,
      avatar: updatedUser.avatar,
      token: generateToken(updatedUser._id, updatedUser.role, updatedUser.name),
    });
  } else {
    return next(new ErrorResponse('User not found', 404));
  }
});

// @desc    Forgot Password - Generate & Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    // Return success even if user not found to prevent email enumeration
    return res.status(200).json({ message: 'If that email is in our system, we have sent a reset code.' });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Set OTP and expiration (10 minutes)
  user.resetPasswordOTP = otp;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  // Send email
  try {
    await sendOTPEmail(user.email, otp);
    console.log(`\n==========================================\n🔑 PASSWORD RESET OTP FOR ${user.email}: ${otp}\n==========================================\n`);
    res.status(200).json({ message: 'If that email is in our system, we have sent a reset code.' });
  } catch (err) {
    console.error('Failed to send OTP Email:', err);
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new ErrorResponse('Please provide email and OTP', 400));
  }

  const user = await User.findOne({
    email,
    resetPasswordOTP: otp,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid or expired OTP', 400));
  }

  res.status(200).json({ message: 'OTP verified successfully' });
});

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, otp, password } = req.body;

  if (!email || !otp || !password) {
    return next(new ErrorResponse('Please provide all required fields', 400));
  }

  const user = await User.findOne({
    email,
    resetPasswordOTP: otp,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid or expired OTP', 400));
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  // Clear OTP fields
  user.resetPasswordOTP = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({ message: 'Password has been reset successfully' });
});

// Generate JWT
const generateToken = (id, role, name) => {
  return jwt.sign({ id, role, name }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  uploadAvatar,
  updateUserProfile,
  forgotPassword,
  verifyOTP,
  resetPassword
};
