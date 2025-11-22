const mongoose = require('mongoose');

const errorlogSchema = new mongoose.Schema({
    type: String,
    where: String,
    description: String,

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Error_Log', errorlogSchema);