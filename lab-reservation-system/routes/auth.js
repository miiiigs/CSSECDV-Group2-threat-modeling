
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Error_Log = require("../models/Error_Log");
const fs = require("fs");
const path = require("path");

const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Registration page (GET)
router.get("/register", (req, res) => {
  res.render("partials/register", { showRoleSelect: true });
});

// 🔑 Login API
router.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      let error = new Error_Log({
        type: "Warn",
        where: "Auth : Post /api/login",
        description: "User attempted to login with invalid credentials",
      });
      await error.save();
      return res.status(401).json({ message: "Invalid username and/or password" });
    }

    // Check for account lockout
    const maxAttempts = 5;
    const lockoutMinutes = 15;
    if (user.accountLocked && user.lastFailedLogin) {
      const now = new Date();
      const lockoutEnd = new Date(user.lastFailedLogin.getTime() + lockoutMinutes * 60000);
      if (now < lockoutEnd) {
        return res.status(403).json({ message: `Account locked. Try again after ${lockoutEnd.toLocaleTimeString()}.` });
      } else {
        // Unlock account after cooldown
        user.accountLocked = false;
        user.failedLoginAttempts = 0;
        await user.save();
      }
    }

    if (await user.comparePassword(password)) {
      user.failedLoginAttempts = 0;
      user.lastLogin = new Date();
      await user.save();
      req.session.user = {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      };
      return res.status(200).json({ message: "Login successful" });
    } else {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      user.lastFailedLogin = new Date();
      let error = new Error_Log({
        type: "Warn",
        where: "Auth : Post /api/login",
        description: `Failed login attempt for user ${user.email}`,
      });
      await error.save();
      if (user.failedLoginAttempts >= maxAttempts) {
        user.accountLocked = true;
        await user.save();
        return res.status(403).json({ message: `Account locked due to too many failed attempts. Try again after ${lockoutMinutes} minutes.` });
      } else {
        await user.save();
        return res.status(401).json({ message: "Invalid username and/or password" });
      }
    }
  } catch (err) {
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
    const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
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

// --- PASSWORD RESET FLOW ---

// 1. Request password reset (by email)
router.post("/auth/request-password-reset", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with that email." });
    }
    if (!user.securityQuestions || user.securityQuestions.length === 0) {
      return res.status(400).json({ message: "No security questions set for this account. Contact admin." });
    }
    // Return questions (no answers) for next step
    const questions = user.securityQuestions.map(q => ({ question: q.question }));
    res.json({ message: "Answer your security questions.", email, questions });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// 2. Verify security questions
router.post("/auth/verify-security-questions", async (req, res) => {
  try {
    const { email, answers } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.securityQuestions || user.securityQuestions.length === 0) {
      return res.status(400).json({ message: "Invalid request." });
    }
    if (!Array.isArray(answers) || answers.length !== user.securityQuestions.length) {
      return res.status(400).json({ message: "All questions must be answered." });
    }
    // Check answers (case-insensitive, hash compare)
    for (let i = 0; i < answers.length; i++) {
      const ok = await bcrypt.compare(answers[i], user.securityQuestions[i].answerHash);
      if (!ok) {
        return res.status(401).json({ message: "Incorrect answer to one or more security questions." });
      }
    }
    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 15); // 15 min expiry
    await user.save();
    // Return URL for next step
    res.json({ resetUrl: `/reset-password/form?token=${token}` });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// 3. Reset password (with token)
router.post("/auth/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Missing fields." });
    }
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: new Date() } });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }
    // Enforce password complexity
    const minLength = 8;
    const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (newPassword.length < minLength) {
      return res.status(400).json({ message: "Password must be at least 8 characters long." });
    }
    if (!complexityRegex.test(newPassword)) {
      return res.status(400).json({ message: "Password must contain uppercase, lowercase, number, and special character." });
    }
    // Enforce password history (no reuse of last 5)
    const prevHashes = user.passwordHistory || [];
    for (let hash of prevHashes.slice(-5)) {
      if (await bcrypt.compare(newPassword, hash)) {
        return res.status(400).json({ message: "You cannot reuse your last 5 passwords." });
      }
    }
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);
    user.passwordHistory = [...(user.passwordHistory || []), user.password];
    if (user.passwordHistory.length > 5) {
      user.passwordHistory = user.passwordHistory.slice(-5);
    }
    user.password = newHash;
    user.updatedAt = new Date();
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: "Password reset successful! You may now log in." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});