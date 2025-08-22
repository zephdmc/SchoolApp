const mongoose = require('mongoose');

const examTimetableSchema = new mongoose.Schema({
  className: {  // Changed from class (ID) to className (String)
    type: String,
    required: true
  },
  term: {
    type: String,
    required: true
  },
  examName: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  schedule: [{
    date: {
      type: Date,
      required: true
    },
    subjectName: {  // Changed from subject (ID) to subjectName (String)
      type: String,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    room: String,
    supervisorName: {  // Changed from supervisor (ID) to supervisorName (String)
      type: String
    },
    notes: String
  }],
  published: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ExamTimetable', examTimetableSchema);




