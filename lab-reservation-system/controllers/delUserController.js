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
    const userId = req.body.selectedUser;
    // Strict validation: userId must be a string of digits, length 6-10
    if (!userId || typeof userId !== "string" || !/^[0-9]{6,10}$/.test(userId)) {
      let error = new Error_Log({
        type: "Validation Failure",
        where: "Controller: deleteUser",
        description: "Invalid User ID input",
        error: userId
      });
      await error.save();
      return res.status(400).send("Invalid input. Please try again.");
    }
    const userDat = await User.findOne({'id': userId}).lean();
    if (!userDat) {
      let error = new Error_Log({
        type: "Validation Failure",
        where: "Controller: deleteUser",
        description: "User not found for deletion",
        error: userId
      });
      await error.save();
      return res.status(404).send("User not found.");
    }
    await User.deleteOne({'id': userId});

    if(req.session.user.role === 'admin')
      var users = await User.find({'role': { $nin: ["student"] }}).lean();
    else
      users = await User.find({'role': { $in: ["student"] }}).lean();
    
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