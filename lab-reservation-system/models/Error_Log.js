const mongoose = require('mongoose');

const errorlogSchema = new mongoose.Schema({
    type: String,
    where: String,
    description: String,
    error: mongoose.Schema.Types.Mixed, // Add this to store error details
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Error_Log', errorlogSchema);