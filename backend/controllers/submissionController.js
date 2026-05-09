const Submission = require('../models/Submission');
const Assessment = require('../models/Assessment');
const { asyncHandler, ErrorResponse } = require('../middleware/errorMiddleware');
const { sendGradingEmail } = require('../utils/emailService');

// @desc  Get ALL submissions (Instructor sees submissions for their assessments)
// @route GET /api/submissions/all
// @access Private (Instructor/Admin)
const getAllSubmissions = asyncHandler(async (req, res, next) => {
  // Find assessments belonging to this instructor
  const myAssessments = await Assessment.find({ instructor: req.user._id }).select('_id');
  const myAssessmentIds = myAssessments.map(a => a._id);

  const submissions = await Submission.find({ assessment: { $in: myAssessmentIds } })
    .populate('student', 'name email')
    .populate('assessment', 'title subject type totalMarks')
    .sort({ submittedAt: -1 });

  res.json(submissions);
});

// @desc  Submit answers for an assessment
// @route POST /api/submissions
// @access Private (Student)
const submitAssessment = asyncHandler(async (req, res, next) => {
  const { assessmentId, answers } = req.body;

  const assessment = await Assessment.findById(assessmentId);
  if (!assessment) {
    return next(new ErrorResponse('Assessment not found', 404));
  }

  const existing = await Submission.findOne({
    student: req.user._id,
    assessment: assessmentId,
  });
  if (existing) {
    return next(new ErrorResponse('You have already submitted this assessment', 400));
  }

  const totalMarks = assessment.questions.reduce((sum, q) => sum + q.marks, 0);

  const submission = await Submission.create({
    student: req.user._id,
    assessment: assessmentId,
    answers: answers || [],
    totalMarks,
    status: 'Pending',
  });

  res.status(201).json({ message: 'Assessment submitted successfully!', submission });
});

// @desc  Get current student's submission history
// @route GET /api/submissions/my
// @access Private (Student)
const getMySubmissions = asyncHandler(async (req, res, next) => {
  const submissions = await Submission.find({ student: req.user._id })
    .populate('assessment', 'title subject type duration')
    .sort({ submittedAt: -1 });

  res.json(submissions);
});

// @desc  Get dashboard stats for current student
// @route GET /api/submissions/stats
// @access Private
const getMyStats = asyncHandler(async (req, res, next) => {
  const submissions = await Submission.find({ student: req.user._id }).populate('assessment', 'subject');

  const totalTaken = submissions.length;
  const evaluated = submissions.filter(s => s.status === 'Evaluated');
  const pending = submissions.filter(s => s.status === 'Pending').length;

  const avgScore = evaluated.length > 0
    ? Math.round(evaluated.reduce((sum, s) => sum + (s.score / s.totalMarks) * 100, 0) / evaluated.length)
    : 0;

  // Aggregate by subject for weakness analysis
  const subjectMap = {};
  evaluated.forEach(s => {
    const sub = s.assessment?.subject || 'Other';
    if (!subjectMap[sub]) subjectMap[sub] = { total: 0, scoreSum: 0, count: 0 };
    subjectMap[sub].total += s.totalMarks;
    subjectMap[sub].scoreSum += s.score;
    subjectMap[sub].count += 1;
  });

  const subjectStats = Object.keys(subjectMap).map(sub => ({
    subject: sub,
    avgScore: Math.round((subjectMap[sub].scoreSum / subjectMap[sub].total) * 100),
    count: subjectMap[sub].count
  }));

  res.json({ totalTaken, avgScore, pending, subjectStats });
});

// @desc  Grade a submission (Instructor only)
// @route PATCH /api/submissions/:id/grade
// @access Private
const gradeSubmission = asyncHandler(async (req, res, next) => {
  const { score, feedback } = req.body;
  const submission = await Submission.findById(req.params.id)
    .populate('student', 'name email')
    .populate('assessment', 'title');

  if (!submission) {
    return next(new ErrorResponse('Submission not found', 404));
  }

  submission.score = score;
  submission.feedback = feedback || '';
  submission.status = 'Evaluated';
  await submission.save();

  // Trigger Email Notification
  try {
     await sendGradingEmail(
       submission.student.email,
       submission.student.name,
       submission.assessment.title,
       submission.score,
       submission.totalMarks,
       submission.feedback
     );
  } catch (emailErr) {
    console.error('Email could not be sent:', emailErr.message);
    // We don't fail the request if email fails, but we log it
  }

  res.json({ message: 'Graded successfully and student notified!', submission });
});

module.exports = { submitAssessment, getMySubmissions, getMyStats, getAllSubmissions, gradeSubmission };
