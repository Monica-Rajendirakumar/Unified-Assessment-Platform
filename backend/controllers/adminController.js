const User = require('../models/User');
const Submission = require('../models/Submission');
const Assessment = require('../models/Assessment');

// @desc  Get all users (Admin only)
// @route GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc  Get all submissions (Admin view)
// @route GET /api/admin/submissions
const getAllSubmissionsAdmin = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate('student', 'name email')
      .populate('assessment', 'title subject type')
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc  Get platform statistics (Admin only)
// @route GET /api/admin/stats
const getAdminStats = async (req, res) => {
  try {
    const userStats = await User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]);
    const totalAssessments = await Assessment.countDocuments();
    const submissionStats = await Submission.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          avgScore: { $avg: { $divide: ["$score", "$totalMarks"] } }
        }
      }
    ]);

    res.json({
      users: userStats,
      assessments: totalAssessments,
      submissions: submissionStats,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAllUsers, getAllSubmissionsAdmin, getAdminStats };
