const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/User");
const Error_Log = require("../models/Error_Log");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload-pfp/:userId", upload.single("profilePic"), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      // Create error log
      let error = new Error_Log({
        type: "Warn",
        where: "Upload : Post /upload-pfp/:userId",
        description: "Error fetching user",
        error: err
      });
      await error.save();

      return res.status(404).send("User not found");
    }

    user.profilePic = {
      data: req.file.buffer,
      contentType: req.file.mimetype
    };

    await user.save();
    res.send("Profile picture updated!");
  } catch (err) {
    // Create error log
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
