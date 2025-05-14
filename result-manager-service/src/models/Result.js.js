const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    classId: { type: String, required: true },
    subject: { type: String, required: true },
    scores: [
        {
            assessment: { type: Number, required: true },
            exam: { type: Number, required: true },
        }
    ],
    term: { type: String, required: true },
    session: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Result', ResultSchema);
