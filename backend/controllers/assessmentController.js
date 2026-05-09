const Assessment = require('../models/Assessment');
const User = require('../models/User');
const { asyncHandler, ErrorResponse } = require('../middleware/errorMiddleware');
const { sendNewAssessmentEmail } = require('../utils/emailService');

// @desc  Get all active assessments (for the catalog)
// @route GET /api/assessments
// @access Private
const getAssessments = asyncHandler(async (req, res, next) => {
  const assessments = await Assessment.find({ isActive: true })
    .populate('instructor', 'name email avatar')
    .select('-questions'); // Don't send questions in catalog view (perf)
  res.json(assessments);
});

// @desc  Get a single assessment with all questions (for the test UI)
// @route GET /api/assessments/:id
// @access Private
const getAssessmentById = asyncHandler(async (req, res, next) => {
  const assessment = await Assessment.findById(req.params.id)
    .populate('instructor', 'name email avatar');

  if (!assessment) {
    return next(new ErrorResponse('Assessment not found', 404));
  }

  res.json(assessment);
});

// @desc  Create a new assessment (Instructor only)
// @route POST /api/assessments
// @access Private (Instructor/Admin)
const createAssessment = asyncHandler(async (req, res, next) => {
  const { title, description, subject, type, duration, questions, dueDate } = req.body;

  const assessment = await Assessment.create({
    title,
    description,
    subject,
    type,
    duration,
    questions,
    dueDate,
    instructor: req.user._id,
  });

  // Trigger Email Notifications to Students
  try {
     const students = await User.find({ role: 'Student' }).select('email');
     const studentEmails = students.map(s => s.email);
     
     if (studentEmails.length > 0) {
       await sendNewAssessmentEmail(studentEmails, title, subject, dueDate);
     }
  } catch (emailErr) {
    console.error('New assessment email failed:', emailErr.message);
  }

  res.status(201).json(assessment);
});

// @desc  Update an assessment (Instructor only)
// @route PUT /api/assessments/:id
const updateAssessment = asyncHandler(async (req, res, next) => {
  let assessment = await Assessment.findById(req.params.id);
  if (!assessment) return next(new ErrorResponse('Assessment not found', 404));
  
  if (assessment.instructor.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('Not authorized to update this assessment', 401));
  }

  assessment = await Assessment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(assessment);
});

// @desc  Delete an assessment (Instructor only)
// @route DELETE /api/assessments/:id
const deleteAssessment = asyncHandler(async (req, res, next) => {
  const assessment = await Assessment.findById(req.params.id);
  if (!assessment) return next(new ErrorResponse('Assessment not found', 404));

  if (assessment.instructor.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('Not authorized to delete this assessment', 401));
  }

  await Assessment.findByIdAndDelete(req.params.id);
  res.json({ message: 'Assessment removed successfully' });
});

module.exports = { getAssessments, getAssessmentById, createAssessment, updateAssessment, deleteAssessment };
