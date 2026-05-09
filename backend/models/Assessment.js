const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  type: { type: String, enum: ['MCQ', 'Written', 'Coding'], default: 'MCQ' },
  options: [{ type: String }],        // Only for MCQ
  marks: { type: Number, default: 5 },
});

const assessmentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  subject: { type: String, required: true },
  type: { type: String, enum: ['MCQ', 'Written', 'Coding', 'Mixed'], default: 'MCQ' },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  duration: { type: Number, default: 60 }, // minutes
  dueDate: { type: Date },
  questions: [questionSchema],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Performance Optimization: Indexing frequently searched fields
assessmentSchema.index({ instructor: 1, isActive: 1 });

module.exports = mongoose.model('Assessment', assessmentSchema);
