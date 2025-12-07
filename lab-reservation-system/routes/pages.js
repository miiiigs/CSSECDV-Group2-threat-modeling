const express = require("express");
const router = express.Router();

// 🟢 Basic Routes
router.get("/", (req, res) => res.redirect("/index"));
router.get("/index", (req, res) => res.render("index"));

router.get("/login", (req, res) =>
  res.render("partials/login", { layout: "main_nonav" })
);

router.get("/register", (req, res) =>
  res.render("partials/register", { layout: "main_nonav" })
);

// Password reset request page
router.get("/reset-password", (req, res) =>
  res.render("partials/reset_password_request", { layout: "main_nonav" })
);

// Security questions page (rendered after email is submitted)
router.get("/reset-password/questions", (req, res) => {
  // expects: req.query.email, req.query.questions (array)
  // In real use, this would be rendered after backend validation
  const { email } = req.query;
  // For demo, use static questions; in real, pass from backend
  const questions = req.query.questions ? JSON.parse(req.query.questions) : [];
  res.render("partials/reset_password_questions", { layout: "main_nonav", email, questions });
});

// New password form (rendered after questions are answered)
router.get("/reset-password/form", (req, res) => {
  // expects: req.query.token
  const { token } = req.query;
  res.render("partials/reset_password_form", { layout: "main_nonav", token });
});

module.exports = router; 