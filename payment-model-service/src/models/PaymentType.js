const mongoose = require('mongoose');

const paymentTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  dueDate: {
    type: Date
  },
  academicSession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicSession'
  },
  level: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Level'
  }
}, { timestamps: true });

const PaymentType = mongoose.model('PaymentType', paymentTypeSchema);

module.exports = PaymentType;
