const express = require('express');
const {
  createPaymentType,
  getPaymentTypes,
  getAllPayments,
  getStudentPaymentsDue,
  initiatePayment,
  verifyPayment,
  getStudentPaymentStatus, // <- Add this
  getStudentPayments
} = require('../controller/paymentController');

const router = express.Router();

router.get('/status/:studentId', getStudentPaymentStatus); // <- New route
// Admin routes
router.route('/types')
  .post(createPaymentType)
  .get(getPaymentTypes);
router.get('/all', getAllPayments);
// Student routes
router.get('/due/:id', getStudentPaymentsDue);
router.post('/initiate', initiatePayment);
router.get('/verify/:reference', verifyPayment);
router.get('/payments/status/:studentID/:class', getStudentPayments);


module.exports = router;