// const mongoose = require('mongoose');

// const ResultSchema = new mongoose.Schema({
//     student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }, // Reference to Student model
//     teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }, // Reference to Teacher model
//     class: { type: String, required: true }, // Example: "JSS1"
//     // session: { type: String, required: true }, // Example: "2024/2025"
//     subject: { type: String, required: true }, // Example: "Mathematics"
//     assignments: { type: Number, required: true, default: 0 }, // Score for assignments
//     test1: { type: Number, required: true, default: 0 }, // First test score
//     test2: { type: Number, required: true, default: 0 }, // Second test score
//     exam: { type: Number, required: true, default: 0 }, // Exam score
//     total_score: { type: Number, required: true, default: 0 }, // Total calculated score
//     status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }, // Status of the result
//     createdAt: { type: Date, default: Date.now } // Timestamp for record creation
// });
// module.exports = mongoose.model('Result', ResultSchema);



// const mongoose = require("mongoose");

// const ResultSchema = new mongoose.Schema({
//   student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
//   teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
//   classSelected: { type: String, required: true }, // Renamed from 'class'
//   subject: { type: String, required: true },
//   assignments: { type: Number, default: 0 },
//   test1: { type: Number, default: 0 },
//   test2: { type: Number, default: 0 },
//   test3: { type: Number, default: 0 }, // Added test3 field
//   exam: { type: Number, default: 0 },
//   total_score: { type: Number, default: 0 },
//   status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Result", ResultSchema);


const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  classSelected: { type: String, required: true }, // Renamed from 'class'
  subject: { type: String, required: true },
  assignments: { type: Number, default: 0 },
  test1: { type: Number, default: 0 },
  test2: { type: Number, default: 0 },
  test3: { type: Number, default: 0 }, // Added test3 field
  exam: { type: Number, default: 0 },
  total_score: { type: Number, default: 0 },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  term_id: { type: mongoose.Schema.Types.ObjectId, ref: "Term", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Result", ResultSchema);