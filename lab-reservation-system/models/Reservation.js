const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  seatNumber: Number,
  labNumber: Number,
  date: String,         // e.g., "2025-07-13"
  startTime: String,    // e.g., "1000"
  endTime: String,      // e.g., "1130"
  reservedBy: {
    type: String,
    default: 'Anonymous'
  },
  id: Number
}, {
  timestamps: true  
});

module.exports = mongoose.model('Reservation', reservationSchema);
