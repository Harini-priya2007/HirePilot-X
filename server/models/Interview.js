const mongoose = require('mongoose');

const feedbackItemSchema = new mongoose.Schema(
  {
    question: String,
    answer: String,
    comment: String,
  },
  { _id: false }
);

const evaluationSchema = new mongoose.Schema(
  {
    score: { type: Number, default: 0, min: 0, max: 100 },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    suggestions: { type: [String], default: [] },
    feedback: { type: [feedbackItemSchema], default: [] },
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    domain: {
      type: String,
      required: true,
      enum: ['Frontend', 'Backend', 'Full Stack', 'Data Analyst', 'HR'],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium', 'Hard'],
    },
    questions: {
      type: [String],
      default: [],
    },
    answers: {
      type: [String],
      default: [],
    },
    evaluation: {
      type: evaluationSchema,
      default: null,
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed'],
      default: 'in_progress',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Interview', interviewSchema);
