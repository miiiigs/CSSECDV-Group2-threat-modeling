const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Reservation = require("../models/Reservation");
const Error_Log = require("../models/Error_Log");
const multer = require("multer");

const bcrypt = require("bcrypt");

// 📦 Multer (store uploaded files in memory)
const upload = multer({ storage: multer.memoryStorage() });

// Import isAuthenticated middleware
const { authCheck } = require('../middleware/auth');

// Apply authCheck to all protected routes
router.use(authCheck());

// 📸 Update profile
router.post("/update-profile", upload.single("profilePicture"), async (req, res) => {
  try {
    const updateFields = {
      username: req.body.username,
      pronouns: req.body.pronouns,
      phoneNumber: req.body.phoneNumber,
      bio: req.body.bio,
    };

    if (req.file) {
      updateFields.profilePicture = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    // Strict validation for profile update fields
    if (req.body.username && !/^[A-Za-z0-9._-]{3,30}$/.test(req.body.username)) {
      return res.status(400).send("Username must be 3-30 characters, letters, numbers, dot, underscore, or dash.");
    }
    if (req.body.pronouns && !/^[A-Za-z\s/-]{2,30}$/.test(req.body.pronouns)) {
      return res.status(400).send("Pronouns must be 2-30 letters.");
    }
    if (req.body.phoneNumber && !/^[0-9+\-]{7,15}$/.test(req.body.phoneNumber)) {
      return res.status(400).send("Phone number must be 7-15 digits or valid symbols.");
    }
    if (req.body.bio && req.body.bio.length > 200) {
      return res.status(400).send("Bio must be 200 characters or less.");
    }

    await User.findByIdAndUpdate(req.session.user._id, updateFields);
    res.redirect("/profile");
  } catch (err) {

    // Create error log
      let error = new Error_Log({
        type: "Error",
        where: "Profile : Post /update-profile",
        description: "Error updating user profile",
        error: err
      });
      await error.save();

    console.error("Error updating profile:", err);
    res.status(500).send("Error updating profile");
  }
});

// Profile page
router.get("/profile", authCheck(), async (req, res) => {
  try {
    const userDoc = await User.findById(req.session.user._id).lean();

    // Extract base64 string from Binary
    let profilePicBase64 = null;
    if (userDoc.profilePicture && userDoc.profilePicture.data) {
      profilePicBase64 = userDoc.profilePicture.data.toString("base64");
    }

    const user = {
      ...userDoc,
      profilePicBase64,
      profilePicContentType: userDoc.profilePicture?.contentType || "image/png",
    };

    const reservations = await Reservation.find({
      reservedBy: user.email,
    }).lean();

    res.render("partials/profile", {
      user,
      reservations,
      viewP: true,
    });
  } catch (err) {

    // Create error log
      let error = new Error_Log({
        type: "Error",
        where: "Profile : Get /profile",
        description: "Error loading user profile",
        error: err
      });
      await error.save();

    console.error("Error loading profile:", err);
    res.status(500).send("Error loading profile");
  }
});

module.exports = router; 

// Set security questions for logged-in user
router.post("/set-security-questions", async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: "Not authenticated." });
    }
    const { questions } = req.body;
    if (!Array.isArray(questions) || questions.length < 2) {
      return res.status(400).json({ message: "Two security questions required." });
    }
    // List of common answers to reject
    const commonAnswers = ["the bible", "blue", "dog", "cat", "pizza", "football", "basketball", "red", "green", "yellow", "black", "white", "123456", "password", "qwerty"];
    // Validate answers for randomness and length
    for (const q of questions) {
      if (!q.answer || typeof q.answer !== "string" || q.answer.length < 4) {
        return res.status(400).json({ message: "Answers must be at least 4 characters." });
      }
      if (commonAnswers.includes(q.answer.trim().toLowerCase())) {
        return res.status(400).json({ message: "Please choose less common answers for your security questions." });
      }
    }
    // Hash answers
    const hashedQuestions = await Promise.all(questions.map(async q => ({
      question: q.question,
      answerHash: await require('bcrypt').hash(q.answer, 10)
    })));
    const user = await User.findById(req.session.user._id);
    user.securityQuestions = hashedQuestions;
    await user.save();
    res.json({ message: "Security questions saved!" });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// Change password route (AJAX)
router.post("/change-password", async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: "Not authenticated." });
    }
    // Require recent re-authentication (within last 5 minutes)
    const now = Date.now();
    if (!req.session.lastAuthTime || now - req.session.lastAuthTime > 5 * 60 * 1000) {
      return res.status(403).json({ message: "Please re-authenticate before changing your password." });
    }
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Missing fields." });
    }
    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      let error = new Error_Log({
        type: "Warn",
        where: "Profile : Post /change-password",
        description: `Incorrect current password for user ${user.email}`,
      });
      await error.save();
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    // Enforce minimum password age (1 day)
    if (user.passwordHistory && user.passwordHistory.length > 0) {
      const lastChange = user.passwordHistory[user.passwordHistory.length - 1];
      if (lastChange && user.updatedAt) {
        const now = new Date();
        const minAgeMs = 24 * 60 * 60 * 1000; // 1 day
        if (now - user.updatedAt < minAgeMs) {
          return res.status(400).json({ message: "You must wait at least 1 day before changing your password again." });
        }
      }
    }

    // Enforce password complexity
    const minLength = 8;
    const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
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
    // const salt = await bcrypt.genSalt(10);
    // const newHash = await bcrypt.hash(newPassword, salt);

    // Update password and history
    user.passwordHistory = [...(user.passwordHistory || []), user.password];
    if (user.passwordHistory.length > 5) {
      user.passwordHistory = user.passwordHistory.slice(-5);
    }
    user.password = newPassword; // Set plain password, let pre-save hook hash it
    user.updatedAt = new Date();
    await user.save();

    let log = new Error_Log({
      type: "Info",
      where: "Profile : Post /change-password",
      description: `Password changed for user ${user.email}`,
    });
    await log.save();

    res.json({ message: "Password changed successfully." });
  } catch (err) {
    let error = new Error_Log({
      type: "Error",
      where: "Profile : Post /change-password",
      description: `Error changing password for user ${req.session?.user?.email || 'unknown'}: ${err.message}`,
      error: {
        stack: err.stack,
        name: err.name,
        message: err.message,
        code: err.code || null,
        body: req.body,
        session: req.session?.user || null
      }
    });
    await error.save();
    res.status(500).json({ message: "Server error." });
  }
});


