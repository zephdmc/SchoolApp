const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  paymentType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentType',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  reference: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'successful', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['opay', 'bank', 'cash'],
    default: 'opay'
  },
  datePaid: {
    type: Date,
    default: Date.now
  },
  verified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
