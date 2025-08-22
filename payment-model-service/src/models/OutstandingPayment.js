const mongoose = require('mongoose');

const OutstandingPaymentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  paymentType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentType',
    required: true
  },
  originalAmount: {
    type: Number,
    required: true
  },
  amountDue: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  originalDueDate: {
    type: Date,
    required: true
  },
  academicSession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicSession',
    required: true
  },
  originalLevel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Level',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'partially_paid', 'paid'],
    default: 'pending'
  },
  lastReminderSent: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('OutstandingPayment', OutstandingPaymentSchema);