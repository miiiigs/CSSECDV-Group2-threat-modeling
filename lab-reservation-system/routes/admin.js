const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Error_Log = require("../models/Error_Log");
const userController = require('../controllers/delUserController');

const fs = require("fs");
const path = require("path");

// Import auth middleware
const { requireRole } = require('../middleware/auth');

// ❌ Admin: Delete User
router.get("/delete-user", requireRole('admin','labtech'), async (req, res) => {
  try {
    const {id, email, username} = req.query;
    const query = {};
    
    const inp = req.query.searchInput;
    const opt = req.query.searchField;
    
    if(opt == 'id') query.id = req.query.searchInput;
    else if(opt == 'email') query.email = req.query.searchInput;
    else if(opt == 'username') query.username = req.query.searchInput;

    // If admin, query for admin & labtech. If labtech, query for students
    if(req.session.user.role === 'admin')
      query.role = { $nin: ["student"] };
    else
      query.role = { $in: ["student"] };

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

router.post('/delete-post', requireRole('admin','labtech'), userController.deleteUser);

// Admin: View logs
router.get("/log-history", requireRole('admin'), async (req, res) => {
  try {
  
  const {category} = req.query;
  const query = {};
  
  if(category != "All")
    query.type = category;
  _logs = await Error_Log.find(query).lean();

  res.render("partials/admin_log_history", {
    logs: _logs,
    query: req.query
  });

  } catch (err) {
    // Create error log
      let error = new Error_Log({
        type: "Error",
        where: "Route Admin : Get /log-history",
        description: "Error viewing logs",
        error: err
      });
      await error.save();
  }
});

// 📝 Create account Routes
router.get("/create-user", requireRole('admin'), (req, res) => {
  res.render("partials/admin_create_acc", { showRoleSelect: true });
});

router.post("/create-post", requireRole('admin'), async (req, res) => {
  try {
    const defaultImage = fs.readFileSync(
      path.join(__dirname, "../public/data/default-pfp.png")
    );
    const existingUser = await User.findOne({ id: req.body.id });
    if (existingUser) {
      let error = new Error_Log({
        type: "Warn",
        where: "Admin : Post /create-user",
        description: "User attempted to an user account with existing User ID",
      });
      await error.save();
      return res.status(400).send("User ID already exists.");
    }

    // Password policy enforcement
    const password = req.body.password;
    const minLength = 8;
    const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!password || password.length < minLength) {
      return res.status(400).send("Password must be at least 8 characters long.");
    }
    if (!complexityRegex.test(password)) {
      return res.status(400).send("Password must contain uppercase, lowercase, number, and special character.");
    }

    // Strict validation for registration fields
    if (!/^[a-zA-Z0-9._%+-]+@dlsu\.edu\.ph$/.test(req.body.email)) {
      return res.status(400).send("Email must be a valid DLSU email address.");
    }
    if (!/^[0-9]{8}$/.test(req.body.id)) {
      return res.status(400).send("ID must be 8 digits.");
    }
    if (!/^[A-Za-z\s'-]{2,30}$/.test(req.body.firstName)) {
      return res.status(400).send("First name must be 2-30 letters.");
    }
    if (!/^[A-Za-z\s'-]{2,30}$/.test(req.body.lastName)) {
      return res.status(400).send("Last name must be 2-30 letters.");
    }

    let role = req.body.role;
    if (role !== 'labtech' && role !== 'admin') {
      role = 'labtech';
    }
    const user = new User({
      username: req.body.email,
      email: req.body.email,
      password: password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      id: req.body.id,
      role,
      profilePicture: {
        data: defaultImage,
        contentType: "image/png",
      },
    });

    await user.save();

    // Update Redirect back to home of admin
    res.redirect("/index");

  } catch (err) {
    let error = new Error_Log({
      type: "Error",
      where: "admin : Post /create-user",
      description: "Error user creation",
      error: err
    });
    await error.save();
    console.error("Registration error:", err);
    res.status(500).send("Error creating user");
  }
});

// Edit user data
router.get("/edit-user", requireRole('admin'), async (req, res) => {
  try {
    const {id, email, username, role} = req.query;
    const query = {};
    
    const inp = req.query.searchInput;
    const opt = req.query.searchField;
    
    if(opt == 'id') query.id = req.query.searchInput;
    else if(opt == 'email') query.email = req.query.searchInput;
    else if(opt == 'username') query.username = req.query.searchInput;

    query.role = { $nin: ["student"] };
    user = await User.find(query).lean();

    res.render("partials/admin_edit_user", {
      usersToEdit: user,
      query: req.query,
      delUser: true
    });

  } catch (err) {
    // Create error log
      let error = new Error_Log({
        type: "Error",
        where: "Route Admin : Get /edit-user",
        description: "Error editing user",
        error: err
      });
      await error.save();

    console.error("Edit user error:", err);
    res.status(500).send("Server error");
  }
});

//router.post('/edit-post', requireRole('admin'), userController.editUser);

module.exports = router; 
        // Access control: only admins can view logs
        if (!req.session.user || req.session.user.role !== 'admin') {
          let error = new Error_Log({
            type: "Access Control Failure",
            where: "Route Admin : Get /log-history",
            description: `Unauthorized log access attempt by user ${req.session.user?.email || 'unknown'}`,
            error: req.session.user
          });
          await error.save();
          return res.status(403).send("Access denied. Admins only.");
        }
        try {
          const {category} = req.query;
          const query = {};
          if(category != "All")
            query.type = category;
          const _logs = await Error_Log.find(query).lean();
          res.render("partials/admin_log_history", {
            logs: _logs,
            query: req.query
          });
        } catch (err) {
          let error = new Error_Log({
            type: "Error",
            where: "Route Admin : Get /log-history",
            description: "Error viewing logs",
            error: err
          });
          await error.save();
          res.status(500).send("Error viewing logs");
        }
      });
