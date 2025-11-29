const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Import models
const User = require("./models/User");
const Reservation = require("./models/Reservation");
const Error_Log = require("./models/Error_Log");

// Import routes
const { authRoutes, profileRoutes, reservationRoutes, adminRoutes, pageRoutes } = require('./routes');

// Import controllers
const userController = require('./controllers/delUserController');

// Setup multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

const app = express();
const PORT = 3000;

// 🔌 MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/LabResDB")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

mongoose.connection.once("open", () => {
  console.log("✅ Connected to MongoDB Compass");
});

// 🧩 Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "your_secret_key", // move to .env in production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// 🛠️ Handlebars setup
app.engine(
  "hbs",
  exphbs.engine({
    extname: "hbs",
    partialsDir: path.join(__dirname, "views/partials"),
    helpers: {
      eq: function(a, b) {
        return a === b;
      }
    }
  })
);
app.set("view engine", "hbs");
app.set("views", "./views");
app.set("view options", { layout: "main" });

// Authenticator
function isAuthenticated(role) {
  if(role == 'Admin'){
    var val = 'LT';
    if(req.session && req.session.user.role == val){
    next()
    } else {
      res.redirect('/logout');
    }
  } else if (role == 'LabTech'){
    var val = false;
    if(req.session && req.session.user.role == val){
      next()
    } else {
      res.redirect('/logout');
    }
  } else if (role == 'Student'){
    var val = 'US';
    if(req.session && req.session.user.role == val){
      next()
    } else {
      res.redirect('/logout');
    }
  }
  else {

      //add error here
      // Create error log
      let error = new Error_Log({
        type: "Warn",
        where: "isAuthenticated",
        description: "User attempted to enter page they are not authenticated in",
      });
      error.save();
      
      res.redirect('/logout');
  }

  
}

// 🟢 Routes
app.use("/", pageRoutes);
app.use("/", authRoutes);
app.use("/", profileRoutes);
app.use("/", reservationRoutes);
app.use("/", adminRoutes);


// 🚀 Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
