const mongoose = require('mongoose');

const ComputationSchema = new mongoose.Schema({
    class: { type: String},
    score: {type: Number},
    grade: { type: String },
    comment: { type: String },
    term: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Computation', ComputationSchema);
