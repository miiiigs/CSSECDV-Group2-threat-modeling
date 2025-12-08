const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Error_Log = require("../models/Error_Log");
const userController = require('../controllers/delUserController');

// Import isAuthenticated middleware
const { isAuthenticated, newAuthCheck,  requireRole } = require('../middleware/auth');

// Apply authentication to all admin routes
router.use(newAuthCheck());

// 🔎 Search (LabTech or Admin)
router.get('/search', requireRole('labtech', 'admin'), async (req, res) => {
  const { username, fullname, studentid } = req.query;

  const query = {};

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

// ❌ Admin: Delete User
router.get("/delete-user", requireRole('admin'), async (req, res) => {
  try {
    const {id, email, username, role} = req.query;
    const query = {};
    
    const inp = req.query.searchInput;
    const opt = req.query.searchField;
    
    if(opt == 'id') query.id = req.query.searchInput;
    else if(opt == 'email') query.email = req.query.searchInput;
    else if(opt == 'username') query.username = req.query.searchInput;

    // Only show students (non-admin, non-labtech) for deletion by default
    query.role = 'student';
    const user = await User.find(query).lean();

    res.render("partials/admin_delete_user", {
      usersToDelete: user,
      query: req.query,
      delUser: true
    });

  } catch (err) {
    // Create error log
      let error = new Error_Log({
        type: "Error",
        where: "Route Admin : Get /delete-user",
        description: "Error deleting user",
        error: err
      });
      await error.save();

    console.error("Delete user error:", err);
    res.status(500).send("Server error");
  }
});

router.post('/delete-post', userController.deleteUser);

// 🔎 Test for new admin
router.get('/temp', requireRole('admin'), async (req, res) => {
  res.render('partials/admin_test', {
  });
});

module.exports = router; 