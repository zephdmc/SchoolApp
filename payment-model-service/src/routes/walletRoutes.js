const express = require('express');
const router = express.Router();
const walletController = require('../controller/WalletController');
// const authMiddleware = require('../middleware/authMiddleware');

// Student routes
router.get('/balance/:studentId',walletController.getWalletBalance);
router.post('/fund/:studentId', walletController.fundWallet);
router.post('/pay/:studentId', walletController.payFromWallet);
router.get('/transactions/:studentId', walletController.getWalletTransactions);
router.post('/verify-flutterwave', walletController.verifyFlutterwavePayment);
// Admin routes
router.get('/admin/all', walletController.getAllWallets);
router.get('/admin/student/:studentId', walletController.getWalletByStudentId);
router.get('/admin/transactions', walletController.getAllTransactions);
router.post('/admin/adjust/:studentId', walletController.adjustWalletBalance);
router.post('/wallet-pay-with-outstanding/:studentId', walletController.payFromWalletWithOutstanding);

module.exports = router;
