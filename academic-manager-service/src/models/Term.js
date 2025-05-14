const mongoose = require('mongoose');

const TermSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    session: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Term', TermSchema);
