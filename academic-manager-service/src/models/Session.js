const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    // year: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: false },
    name: { type: String, required: true },
    description: {type: String, required: true},
    createdAt: { type: Date, default: Date.now },
    startDate: { type: Date, required: true },
    endDate: {type: Date,  required: true}
});

module.exports = mongoose.model('Session', SessionSchema);
