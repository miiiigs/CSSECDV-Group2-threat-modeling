const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const session = require("express-session");

const User = require("../models/User");
const multer = require("multer");
const upload = multer();
/*
document.addEventListener("DOMContentLoaded", () => {
    const delBtn = document.getElementById("delUserBtn");
    const radio = doccument.getElementById

    delBtn?.addEventListener("click", async () =>{
        const selUser = doccument.getElementByName("selectedUser");

    });

});
*/

const deleteUser = async (req, res) => {
  try {
    const Error_Log = require("../models/Error_Log");
    const studentId = req.body.selectedUser;
    // Strict validation: studentId must be a string of digits, length 6-10
    if (!studentId || typeof studentId !== "string" || !/^[0-9]{6,10}$/.test(studentId)) {
      let error = new Error_Log({
        type: "Validation Failure",
        where: "Controller: deleteUser",
        description: "Invalid studentId input",
        error: studentId
      });
      await error.save();
      return res.status(400).send("Invalid input. Please try again.");
    }
    const studentDat = await User.findOne({'id': studentId}).lean();
    if (!studentDat) {
      let error = new Error_Log({
        type: "Validation Failure",
        where: "Controller: deleteUser",
        description: "Student not found for deletion",
        error: studentId
      });
      await error.save();
      return res.status(404).send("User not found.");
    }
    await User.deleteOne({'id': studentId});
    var users = await User.find({'role': 'student'}).lean(); // Get all students (ie non-admin)
    res.render("partials/admin_delete_user", { 
      usersToDelete: users, 
      delUser: true
    });
  } catch (err) {
    let error = new Error_Log({
      type: "Error",
      where: "Controller: deleteUser",
      description: "Error deleting user",
      error: err
    });
    await error.save();
    res.status(500).send("Server error. Please contact admin.");
  }
}

module.exports = {
    deleteUser
}