
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Error_Log = require("../models/Error_Log");
const fs = require("fs");
const path = require("path");

// Registration page (GET)
router.get("/register", (req, res) => {
  res.render("partials/register", { showRoleSelect: true });
});

// 🔑 Login API
router.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({email}); // 🛡️ replace with hashed password
    if (user && await user.comparePassword(password)) {
      req.session.user = {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      };
      res.status(200).json({ message: "Login successful" });
    } else {
      // Create error log
      let error = new Error_Log({
        type: "Warn",
        where: "Auth : Post /api/login",
        description: "User attempted to login with invalid credentials",
      });
      await error.save();
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {


    // Create error log
      let error = new Error_Log({
        type: "Error",
        where: "Auth : Post /api/login",
        description: "Error login",
        error: err
      });
      await error.save();

    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📝 Registration
router.post("/register", async (req, res) => {
  try {
    const defaultImage = fs.readFileSync(
      path.join(__dirname, "../public/data/default-pfp.png")
    );
    const existingUser = await User.findOne({ id: req.body.id });
    if (existingUser) {
      let error = new Error_Log({
        type: "Warn",
        where: "Auth : Post /register",
        description: "User attempted to register with existing User ID",
      });
      await error.save();
      return res.status(400).send("User ID already exists.");
    }

    // Password policy enforcement
    const password = req.body.password;
    const minLength = 8;
    const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!password || password.length < minLength) {
      return res.status(400).send("Password must be at least 8 characters long.");
    }
    if (!complexityRegex.test(password)) {
      return res.status(400).send("Password must contain uppercase, lowercase, number, and special character.");
    }

    let role = req.body.role;
    if (role !== 'student' && role !== 'labtech') {
      role = 'student';
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
    res.redirect("/login");
  } catch (err) {
    let error = new Error_Log({
      type: "Error",
      where: "Auth : Post /register",
      description: "Error user registration",
      error: err
    });
    await error.save();
    console.error("Registration error:", err);
    res.status(500).send("Error creating user");
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.redirect("/");
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

module.exports = router; 