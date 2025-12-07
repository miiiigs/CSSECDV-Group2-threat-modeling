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
    const studentId = req.body.selectedUser;
    const studentDat = await User.findOne({'id': studentId}).lean();
    await User.deleteOne({'id': studentId});
    //res.status(200).json({ message: "Student " + studentDat.id + " | " + studentDat.firstName + " " + studentDat.lastName + " was deleted successfully!" });
    //alert("Student " + studentDat.id + " | " + studentDat.firstName + " " + studentDat.lastName + " was deleted successfully!");
    var users = await User.find({'role': 'student'}).lean(); // Get all students (ie non-admin)
    res.render("partials/admin_delete_user", { 
      usersToDelete: users, 
      delUser: true
    });
  } catch (err) {
    console.log("ERROR: " + err);
    res.status(500).send("Error deleting user");
  }
}

module.exports = {
    deleteUser
}