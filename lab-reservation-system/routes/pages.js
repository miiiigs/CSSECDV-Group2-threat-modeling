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

module.exports = router; 