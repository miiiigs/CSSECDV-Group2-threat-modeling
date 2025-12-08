const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Error_Log = require("../models/Error_Log");
const userController = require('../controllers/delUserController');

// Import isAuthenticated middleware
const { newAuthCheck,  requireRole } = require('../middleware/auth');

// 🔎 Search
router.get('/search', requireRole('labtech'), async (req, res) => {
  const { username, fullname, studentid } = req.query;

  const query = {'role': 'student'};

  if (username) query.username = { $regex: username, $options: 'i' };
  if (fullname) {
    query.$or = [
      { firstName: { $regex: fullname, $options: 'i' } },
      { lastName: { $regex: fullname, $options: 'i' } }
    ];
  }
  if (studentid) query.id = studentid;

  const users = await User.find(query).lean();

  res.render('partials/search', {
    users,
    query: req.query // so input fields stay filled
  });
});

module.exports = router; 