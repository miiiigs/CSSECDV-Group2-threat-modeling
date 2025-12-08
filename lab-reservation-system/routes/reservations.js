const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Reservation = require("../models/Reservation");
const Error_Log = require("../models/Error_Log");

// Import auth middleware
const { newAuthCheck, requireRole } = require('../middleware/auth');

// Apply authentication to all reservation routes
router.use(newAuthCheck());

// 📅 Create Reservation page
router.get("/create", requireRole('labtech','student') , async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id).lean();
      if (user.role === 'labtech')
      res.render("partials/admin_create_reservation", { create: true });
    else res.render("partials/create_reservation", { create: true });
  } catch (err) {

    // Create error log
      let error = new Error_Log({
        type: "Error",
        where: "Reservation: Get /create",
        description: "Error rendering reservation view",
        error: err
      });
      await error.save();

    console.error("Create reservation error:", err);
    res.status(500).send("Server error");
  }
});

// View reservations page
router.get("/view_reservation", requireRole('labtech','student') , async (req, res) => {
  try {
    const { username, lab, pcno } = req.query;
    
    // Build search query
    let searchQuery = {};
    
    if (username && username.trim()) {
      // Search by username (reservedBy field)
      const users = await User.find({
        $or: [
          { username: { $regex: username.trim(), $options: 'i' } },
          { email: { $regex: username.trim(), $options: 'i' } }
        ]
      }).lean();
      
      const userEmails = users.map(u => u.email);
      if (userEmails.length > 0) {
        searchQuery.reservedBy = { $in: userEmails };
      } else {
        // If no users found, search directly in reservedBy field
        searchQuery.reservedBy = { $regex: username.trim(), $options: 'i' };
      }
    }
    
    if (lab && lab.trim()) {
      searchQuery.labNumber = parseInt(lab);
    }
    
    if (pcno && pcno.trim()) {
      searchQuery.seatNumber = parseInt(pcno);
    }

    console.log("Search query:", searchQuery);
    
    const reservationsRaw = await Reservation.find(searchQuery).lean();
    const users = await User.find().lean();

    const userMap = {};
    users.forEach(u => userMap[u.email] = u.username); // assuming reservedBy = email

    const reservations = reservationsRaw.map(r => ({
      ...r,
      username: userMap[r.reservedBy] || "Unknown",
      seatNumbers: Array.isArray(r.seatNumber) ? r.seatNumber : [r.seatNumber],
      createdAt: new Date(r.createdAt).toLocaleString()
    }));

    res.render("partials/view_reservation", {
      reservations,
      viewR: true, 
      user: req.session.user,
      searchParams: { username: username || "", lab: lab || "", pcno: pcno || "" }
    });
  } catch (err) {

    // Create error log
      let error = new Error_Log({
        type: "Error",
        where: "Reservation: Get /view_reservation",
        description: "Error rendering view_reservation view",
        error: err
      });
      await error.save();

    console.error("Error loading reservations:", err);
    res.status(500).send("Internal Server Error");
  }
});

// 📥 Reserve seat API
router.post("/api/seats/reserve", requireRole('labtech','student') , async (req, res) => {

  let { labNumber, seatNumber, date, startTime, endTime, user, idNum } = req.body;
  // Strict validation
  const Error_Log = require("../models/Error_Log");
  if (!labNumber || isNaN(Number(labNumber)) || Number(labNumber) < 1 || Number(labNumber) > 20) {
    let error = new Error_Log({
      type: "Validation Failure",
      where: "Reservation: Post /api/seats/reserve",
      description: "Invalid labNumber",
      error: labNumber
    });
    await error.save();
    return res.status(400).json({ message: "Invalid lab number." });
  }
  if (!seatNumber || isNaN(Number(seatNumber)) || Number(seatNumber) < 1 || Number(seatNumber) > 50) {
    let error = new Error_Log({
      type: "Validation Failure",
      where: "Reservation: Post /api/seats/reserve",
      description: "Invalid seatNumber",
      error: seatNumber
    });
    await error.save();
    return res.status(400).json({ message: "Invalid seat number." });
  }
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    let error = new Error_Log({
      type: "Validation Failure",
      where: "Reservation: Post /api/seats/reserve",
      description: "Invalid date format",
      error: date
    });
    await error.save();
    return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
  }
  if (!startTime || !/^\d{2}:\d{2}$/.test(startTime) || !endTime || !/^\d{2}:\d{2}$/.test(endTime)) {
    let error = new Error_Log({
      type: "Validation Failure",
      where: "Reservation: Post /api/seats/reserve",
      description: "Invalid time format",
      error: { startTime, endTime }
    });
    await error.save();
    return res.status(400).json({ message: "Invalid time format. Use HH:MM." });
  }
  if (!user || typeof user !== "string" || user.length < 3 || user.length > 50) {
    let error = new Error_Log({
      type: "Validation Failure",
      where: "Reservation: Post /api/seats/reserve",
      description: "Invalid user",
      error: user
    });
    await error.save();
    return res.status(400).json({ message: "Invalid user." });
  }
  /*
    if (req.session.user.isLabtech){
      try {
        const existing = await Reservation.findOne({
          labNumber,
          seatNumber,
          date,
          startTime,
        });
        if (existing)
          return res
            .status(400)
            .json({ message: "Seat already reserved for that time." });


        idNum = parseInt(idNum);
        const student_user = await User.findById(idNum);

          
        const reservation = new Reservation({
          labNumber,
          seatNumber,
          date,
          startTime,
          endTime,
          reservedBy: student_user.username,
        });
        await reservation.save();

        res.status(200).json({ message: "Seat reserved successfully." });
      } catch (err) {

        

        console.error("Reservation error:", err);
        res.status(500).json({ message: "Server error during reservation." });
      }
    }
    */

    //student reservation
   // else {
      try {
        const existing = await Reservation.findOne({
          labNumber,
          seatNumber,
          date,
          startTime,
        });
        if (existing)
          return res
            .status(400)
            .json({ message: "Seat already reserved for that time." });

        const reservation = new Reservation({
          labNumber,
          seatNumber,
          date,
          startTime,
          endTime,
          reservedBy: user,
        });
        await reservation.save();

        res.status(200).json({ message: "Seat reserved successfully." });
      } catch (err) {

        // Create error log
          let error = new Error_Log({
            type: "Error",
            where: "Reservation: Post /api/seats/reserve",
            description: "Error reserving seats for user",
            error: err
          });
          await error.save();

        console.error("Reservation error:", err);
        res.status(500).json({ message: "Server error during reservation." });
      }
    //}
  
});

// 📤 Fetch reservations API
router.get('/api/reservations/available', requireRole('labtech','student') , async (req, res) => {
  try {
    const { lab, date, start, end } = req.query;
    
    console.log("API called with params:", { lab, date, start, end });

    // Find reservations that overlap with the given time
    const overlappingReservations = await Reservation.find({
      labNumber: Number(lab),
      date,
      $or: [
        {
          startTime: { $lt: end, $gte: start }
        },
        {
          endTime: { $gt: start, $lte: end }
        },
        {
          startTime: { $lte: start },
          endTime: { $gte: end }
        }
      ]
    });

    console.log("Found overlapping reservations:", overlappingReservations);

    // Create a map of seat numbers to reservedBy information
    const reservedSeatsMap = {};
    overlappingReservations.forEach(reservation => {
      reservedSeatsMap[reservation.seatNumber] = reservation.reservedBy;
    });

    // All seat numbers (1 to 35)
    const allSeats = Array.from({ length: 35 }, (_, i) => i + 1);

    // Filter available seats
    const availableSeats = allSeats.filter(seat => !reservedSeatsMap.hasOwnProperty(seat));
    console.log("Available seats:", availableSeats);
    console.log("Reserved seats map:", reservedSeatsMap);

    res.json({ availableSeats, reservedSeatsMap });
  } catch (err) {

    // Create error log
      let error = new Error_Log({
        type: "Error",
        where: "Reservation: Get /api/reservations/available",
        description: "Error fetching reserved seats",
        error: err
      });
      await error.save();

    console.error("Error in /api/reservations/available:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 🗑️ Delete reservation API
router.delete('/api/reservations/:id', requireRole('labtech','student') , async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log("Delete reservation request received for ID:", id);
    console.log("Session user:", req.session.user);
    
    // Check if user is admin/labtech
      if (!req.session.user || (req.session.user.role !== 'labtech' && req.session.user.role !== 'admin')) {
      console.log("Access denied - user not admin/labtech");
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    const reservation = await Reservation.findById(id);
    
    if (!reservation) {
      console.log("Reservation not found:", id);
      return res.status(404).json({ message: "Reservation not found." });
    }

    console.log("Found reservation to delete:", reservation);
    await Reservation.findByIdAndDelete(id);
    
    console.log(`Reservation ${id} deleted by admin ${req.session.user.email}`);
    res.status(200).json({ message: "Reservation deleted successfully." });
  } catch (err) {
    console.error("Error deleting reservation:", err);
    res.status(500).json({ message: "Server error during deletion." });
  }
});

module.exports = router; 