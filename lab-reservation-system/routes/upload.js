
const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/User");
const Error_Log = require("../models/Error_Log");
const { newAuthCheck } = require('../middleware/auth');

// Apply authentication to all upload routes
router.use(newAuthCheck());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload-pfp/:userId", upload.single("profilePic"), async (req, res) => {
  try {
    // Strict validation
    const userId = req.params.userId;
    if (!userId || typeof userId !== "string" || userId.length < 6 || userId.length > 30) {
      let error = new Error_Log({
        type: "Validation Failure",
        where: "Upload : Post /upload-pfp/:userId",
        description: "Invalid userId",
        error: userId
      });
      await error.save();
      return res.status(400).send("Invalid user ID.");
    }
    const user = await User.findById(userId);
    if (!user) {
      let error = new Error_Log({
        type: "Warn",
        where: "Upload : Post /upload-pfp/:userId",
        description: "User not found",
        error: userId
      });
      await error.save();
      return res.status(404).send("User not found");
    }
    if (!req.file) {
      let error = new Error_Log({
        type: "Validation Failure",
        where: "Upload : Post /upload-pfp/:userId",
        description: "No file uploaded",
        error: null
      });
      await error.save();
      return res.status(400).send("No file uploaded.");
    }
    // Accept only image/png or image/jpeg, max 2MB
    const allowedTypes = ["image/png", "image/jpeg"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      let error = new Error_Log({
        type: "Validation Failure",
        where: "Upload : Post /upload-pfp/:userId",
        description: "Invalid file type",
        error: req.file.mimetype
      });
      await error.save();
      return res.status(400).send("Invalid file type. Only PNG and JPEG allowed.");
    }
    if (req.file.size > 2 * 1024 * 1024) {
      let error = new Error_Log({
        type: "Validation Failure",
        where: "Upload : Post /upload-pfp/:userId",
        description: "File too large",
        error: req.file.size
      });
      await error.save();
      return res.status(400).send("File too large. Max 2MB allowed.");
    }
    user.profilePic = {
      data: req.file.buffer,
      contentType: req.file.mimetype
    };
    await user.save();
    res.send("Profile picture updated!");
  } catch (err) {
    let error = new Error_Log({
      type: "Error",
      where: "Upload : Post /upload-pfp/:userId",
      description: "Error uploading image",
      error: err
    });
    await error.save();
    console.error(err);
    res.status(500).send("Error uploading image");
  }
});

module.exports = router;
