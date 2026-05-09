const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Student', 'Instructor', 'Admin'], default: 'Student' },
  instituteCode: { type: String },
  avatar: { type: String, default: '' },
  resetPasswordOTP: { type: String },
  resetPasswordExpires: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
