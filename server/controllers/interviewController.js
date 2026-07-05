const Interview = require('../models/Interview');
const { generateQuestions, evaluateAnswers } = require('../services/geminiService');

/**
 * POST /api/interviews/start
 * Generate 5 questions via Gemini and create a new interview session.
 */
const startInterview = async (req, res) => {
  const { domain, difficulty } = req.body;

  if (!domain || !difficulty) {
    res.status(400);
    throw new Error('Domain and difficulty are required.');
  }

  const validDomains = ['Frontend', 'Backend', 'Full Stack', 'Data Analyst', 'HR'];
  const validDifficulties = ['Easy', 'Medium', 'Hard'];

  if (!validDomains.includes(domain)) {
    res.status(400);
    throw new Error(`Invalid domain. Must be one of: ${validDomains.join(', ')}`);
  }

  if (!validDifficulties.includes(difficulty)) {
    res.status(400);
    throw new Error(`Invalid difficulty. Must be one of: ${validDifficulties.join(', ')}`);
  }

  console.log(`🤖 Generating ${difficulty} ${domain} questions for user: ${req.user.uid}`);
  const questions = await generateQuestions(domain, difficulty);

  const interview = await Interview.create({
    userId: req.user.uid,
    domain,
    difficulty,
    questions,
    answers: [],
    status: 'in_progress',
  });

  res.status(201).json({
    success: true,
    interviewId: interview._id,
    questions: interview.questions,
    domain: interview.domain,
    difficulty: interview.difficulty,
  });
};

/**
 * POST /api/interviews/:id/submit
 * Save answers, evaluate with Gemini, and mark interview as completed.
 */
const submitInterview = async (req, res) => {
  const { answers } = req.body;

  if (!answers || !Array.isArray(answers) || answers.length !== 5) {
    res.status(400);
    throw new Error('Exactly 5 answers are required.');
  }

  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    res.status(404);
    throw new Error('Interview not found.');
  }

  if (interview.userId !== req.user.uid) {
    res.status(403);
    throw new Error('Not authorized to submit this interview.');
  }

  if (interview.status === 'completed') {
    res.status(400);
    throw new Error('This interview has already been submitted.');
  }

  console.log(`🤖 Evaluating interview ${interview._id} for user: ${req.user.uid}`);
  const evaluation = await evaluateAnswers(
    interview.domain,
    interview.difficulty,
    interview.questions,
    answers
  );

  interview.answers = answers;
  interview.evaluation = evaluation;
  interview.status = 'completed';
  await interview.save();

  res.json({
    success: true,
    interview,
  });
};

/**
 * GET /api/interviews/history
 * Fetch all completed interviews for the logged-in user.
 */
const getHistory = async (req, res) => {
  const interviews = await Interview.find({
    userId: req.user.uid,
    status: 'completed',
  })
    .sort({ createdAt: -1 })
    .select('domain difficulty evaluation.score status createdAt');

  res.json({ success: true, interviews });
};

/**
 * GET /api/interviews/:id
 * Fetch a single interview with full details (for the report page).
 */
const getInterviewById = async (req, res) => {
  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    res.status(404);
    throw new Error('Interview not found.');
  }

  if (interview.userId !== req.user.uid) {
    res.status(403);
    throw new Error('Not authorized to view this interview.');
  }

  res.json({ success: true, interview });
};

module.exports = { startInterview, submitInterview, getHistory, getInterviewById };
