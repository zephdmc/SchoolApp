const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    code: { type: String},
    teacher: { type: String},
    class: { type: String },
    session: { type: String },
    term: { type: String },

    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Subject', SubjectSchema);
