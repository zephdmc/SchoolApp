const express = require('express');
const {
  createPaymentType,
  getPaymentTypes,
  getAllPayments,
  getStudentPaymentsDue,
  initiatePayment,
  verifyPayment,
  getStudentPaymentStatus, // <- Add this
  getStudentPayments,
  getPaymentStatusForTypes,
  updatePaymentType,
  deletePaymentType,
  getStudentOutstandingPayments,
  processOverduePayments,
  outstanding,
  getStudentPaidPayment,
  getPaymentTypeById
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
router.get('/status', getPaymentStatusForTypes);
router.get('/spayType/:id', getStudentPaidPayment);
router.get('/paymentTypeById/:id', getPaymentTypeById);
router.put('/:id', updatePaymentType);
router.delete('/:id', deletePaymentType);
router.get('/process-overdue', processOverduePayments);
router.get('/outstandingPayment/:studentId', outstanding);
router.get('/outstanding/:studentId', getStudentOutstandingPayments);
module.exports = router;








// // Admin routes
// router.post('/types', authMiddleware, adminMiddleware, paymentController.createPaymentType);
// router.get('/types', authMiddleware, adminMiddleware, paymentController.getPaymentTypes);
// router.get('/all', authMiddleware, adminMiddleware, paymentController.getAllPayments);

// // Student routes
// router.get('/due/:id', authMiddleware, paymentController.getStudentPaymentsDue);
// router.post('/initiate', authMiddleware, paymentController.initiatePayment);
// router.get('/verify/:reference', authMiddleware, paymentController.verifyPayment);
// router.get('/status/:studentId', authMiddleware, paymentController.getStudentPaymentStatus);
// router.get('/student/:studentID/:class', authMiddleware, paymentController.getStudentPayments);

