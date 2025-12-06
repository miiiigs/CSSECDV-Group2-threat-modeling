const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Reservation = require("../models/Reservation");
const Error_Log = require("../models/Error_Log");
const multer = require("multer");

// 📦 Multer (store uploaded files in memory)
const upload = multer({ storage: multer.memoryStorage() });

// Import isAuthenticated middleware
const { isAuthenticated, newAuthCheck } = require('../middleware/auth');

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
router.get("/profile", newAuthCheck(), async (req, res) => {
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