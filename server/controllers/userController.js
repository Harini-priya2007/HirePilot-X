const User = require('../models/User');
const Interview = require('../models/Interview');

/**
 * GET /api/users/profile
 * Fetch the logged-in user's profile. Creates one if it doesn't exist.
 */
const getProfile = async (req, res) => {
  let user = await User.findOne({ firebaseUid: req.user.uid });

  if (!user) {
    user = await User.create({
      firebaseUid: req.user.uid,
      email: req.user.email,
      name: req.user.name || '',
      photoURL: req.user.picture || '',
    });
  }

  res.json({ success: true, user });
};

/**
 * PUT /api/users/profile
 * Create or update the user's profile fields.
 */
const updateProfile = async (req, res) => {
  const { name, college, department, targetRole, photoURL } = req.body;

  const user = await User.findOneAndUpdate(
    { firebaseUid: req.user.uid },
    {
      $set: {
        ...(name !== undefined && { name }),
        ...(college !== undefined && { college }),
        ...(department !== undefined && { department }),
        ...(targetRole !== undefined && { targetRole }),
        ...(photoURL !== undefined && { photoURL }),
        email: req.user.email,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.json({ success: true, user });
};

/**
 * GET /api/users/dashboard
 * Returns user profile + interview statistics for the dashboard.
 */
const getDashboard = async (req, res) => {
  let user = await User.findOne({ firebaseUid: req.user.uid });

  if (!user) {
    user = await User.create({
      firebaseUid: req.user.uid,
      email: req.user.email,
      name: req.user.name || '',
      photoURL: req.user.picture || '',
    });
  }

  const completedInterviews = await Interview.find({
    userId: req.user.uid,
    status: 'completed',
  })
    .sort({ createdAt: -1 })
    .select('domain difficulty evaluation.score createdAt');

  const totalInterviews = completedInterviews.length;

  const averageScore =
    totalInterviews > 0
      ? Math.round(
          completedInterviews.reduce(
            (acc, i) => acc + (i.evaluation?.score || 0),
            0
          ) / totalInterviews
        )
      : 0;

  const recentInterviews = completedInterviews.slice(0, 5);

  res.json({
    success: true,
    user,
    stats: {
      totalInterviews,
      averageScore,
    },
    recentInterviews,
  });
};

module.exports = { getProfile, updateProfile, getDashboard };
