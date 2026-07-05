const express = require('express');
const router = express.Router();
const {
  startInterview,
  submitInterview,
  getHistory,
  getInterviewById,
} = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.get('/history', protect, getHistory);          // GET  /api/interviews/history
router.post('/start', protect, startInterview);       // POST /api/interviews/start
router.post('/:id/submit', protect, submitInterview); // POST /api/interviews/:id/submit
router.get('/:id', protect, getInterviewById);        // GET  /api/interviews/:id

module.exports = router;
