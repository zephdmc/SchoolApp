const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
    title: { 
      type: String, 
      required: [true, 'Title is required'],
      trim: true
    },
    startDate: { 
      type: Date, 
      required: [true, 'Start date is required'] 
    },
    endDate: { 
      type: Date, 
      required: [true, 'End date is required'],
      validate: {
        validator: function(v) {
          return v > this.startDate;
        },
        message: 'End date must be after start date'
      }
    },
    eventType: {
      type: String,
      enum: ['event', 'holiday', 'exam', 'meeting', 'other'],
      default: 'event'
    },
  colorCode: {
    type: String,
    default: '#3b82f6' // Default blue color
  },

  targetAudience: {
    type: String,
    enum: ['all', 'students', 'staff', 'specific-class'],
    default: 'all'
  },
  specificClass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);