const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId },
  answer: { type: String, default: '' }, // Student's answer text or selected option
});

const submissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assessment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
  answers: [answerSchema],
  score: { type: Number, default: null }, // null until instructor grades
  totalMarks: { type: Number, default: null },
  status: { type: String, enum: ['Pending', 'Evaluated'], default: 'Pending' },
  feedback: { type: String, default: '' }, // Instructor feedback
  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Performance Optimization: Indexing frequently searched fields
submissionSchema.index({ student: 1, submittedAt: -1 });
submissionSchema.index({ assessment: 1, status: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
