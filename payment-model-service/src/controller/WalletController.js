const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const Payment = require('../models/Payment');
const PaymentType = require('../models/PaymentType');
const { generateReference } = require('../services/helpers');
const OutstandingPayment = require('../models/OutstandingPayment');

// Add to your existing wallet controller
const axios = require('axios');
const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

const verifyFlutterwavePayment = async (req, res) => {
    try {
      const { transaction_id, amount, studentId } = req.body;     
      // 1. First verify the transaction with Flutterwave
      const flutterResponse = await axios.get(
        `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
        {
          headers: {
            Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`
          }
        }
      );
  
      const flutterData = flutterResponse.data.data;
  
      // 2. Validate the payment
      if (flutterData.status !== 'successful' || 
          parseFloat(flutterData.amount) !== parseFloat(amount)) {
        return res.status(400).json({ 
          success: false,
          message: 'Payment verification failed - amount or status mismatch'
        });
      }
  
      // 3. Handle the wallet update (using YOUR studentId, not Flutterwave's)
      let wallet = await Wallet.findOne({ student: studentId });
      
      if (!wallet) {
        wallet = new Wallet({
          student: studentId,
          balance: 0,
          transactions: []
        });
      }
  
      // 4. Create transaction record
      const transaction = new Transaction({
        wallet: wallet._id,
        amount: parseFloat(amount),
        type: 'credit',
        reference: `FLW-${transaction_id}`,
        status: 'successful',
        description: 'Wallet funding via Flutterwave'
      });
  
      await transaction.save();
      
      // 5. Update wallet
      wallet.balance += parseFloat(amount);
      wallet.transactions.push(transaction._id);
      await wallet.save();
  
      res.json({ 
        success: true,
        message: 'Wallet funded successfully',
        newBalance: wallet.balance,
        transactionId: transaction._id // Send your DB's transaction ID
      });
  
    } catch (error) {
      console.error('Verification error:', error);
      res.status(500).json({
        success: false,
        message: error.response?.data?.message || 'Payment processing failed',
        error: error.message
      });
    }
  };



const getWalletBalance = async (req, res) => {
    try {
      const { studentId } = req.params;
      
      // Find or create wallet in one operation
      const wallet = await Wallet.findOneAndUpdate(
        { student: studentId },
        { $setOnInsert: { student: studentId, balance: 0, transactions: [] } },
        { 
          upsert: true,
          new: true,
          setDefaultsOnInsert: true 
        }
      ).populate('transactions');
      
      res.json({
        balance: wallet.balance,
        transactions: wallet.transactions
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
  




// Fund wallet
const fundWallet = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { amount } = req.body;
    
    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }
    
    let wallet = await Wallet.findOne({ student: studentId });
    
    if (!wallet) {
      wallet = new Wallet({
        student: studentId,
        balance: 0
      });
    }
    
    const reference = generateReference();
    const transaction = new Transaction({
      wallet: wallet._id,
      amount,
      type: 'credit',
      reference,
      status: 'successful',
      description: 'Wallet funding'
    });
    
    await transaction.save();
    
    wallet.balance += amount;
    wallet.transactions.push(transaction._id);
    await wallet.save();
    
    res.json({
      message: 'Wallet funded successfully',
      newBalance: wallet.balance,
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Pay school fees from wallet
const payFromWallet = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { paymentTypeIds } = req.body;
    
    // Find wallet
    const wallet = await Wallet.findOne({ student: studentId });
    if (!wallet) {
      return res.status(400).json({ message: 'Wallet not found' });
    }
    
    // Find payment types
    const paymentTypes = await PaymentType.find({
      _id: { $in: paymentTypeIds }
    });
    
    if (paymentTypes.length !== paymentTypeIds.length) {
      return res.status(400).json({ message: 'Invalid payment type(s)' });
    }
    
    const totalAmount = paymentTypes.reduce((sum, pt) => sum + pt.amount, 0);
    
    // Check if wallet has sufficient balance
    if (wallet.balance < totalAmount) {
      return res.status(400).json({ 
        message: 'Insufficient wallet balance',
        requiredAmount: totalAmount,
        currentBalance: wallet.balance
      });
    }
    
    const reference = generateReference();
    
    // Create debit transaction
    const debitTransaction = new Transaction({
      wallet: wallet._id,
      amount: totalAmount,
      type: 'debit',
      reference,
      status: 'successful',
      description: 'School fees payment'
    });
    
    await debitTransaction.save();
    
    // Update wallet balance
    wallet.balance -= totalAmount;
    wallet.transactions.push(debitTransaction._id);
    await wallet.save();
    
    // Create payment records
    const payments = await Promise.all(paymentTypes.map(pt =>
      Payment.create({
        student: studentId,
        paymentType: pt._id,
        amount: pt.amount,
        reference,
        status: 'successful',
        paidAt: new Date(),
        transaction: debitTransaction._id
      })
    ));
    
    res.json({
      message: 'Payment successful',
      reference,
      totalAmount,
      newBalance: wallet.balance,
      paymentIds: payments.map(p => p._id)
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get wallet transactions
const getWalletTransactions = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const wallet = await Wallet.findOne({ student: studentId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    
    const transactions = await Transaction.find({ wallet: wallet._id })
      .sort({ createdAt: -1 });
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Pay school fees from wallet including outstanding payments
const payFromWalletWithOutstanding = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { paymentTypeIds, outstandingIds } = req.body;
    
    console.log('Payment request received:', {
      studentId,
      paymentTypeIds,
      outstandingIds
    });

    // Find wallet
    const wallet = await Wallet.findOne({ student: studentId });
    if (!wallet) {
      return res.status(400).json({ message: 'Wallet not found' });
    }
    
    // Find payment types and outstanding payments
    const [paymentTypes, outstandingPayments] = await Promise.all([
      PaymentType.find({ _id: { $in: paymentTypeIds || [] } }),
      OutstandingPayment.find({ 
        _id: { $in: outstandingIds || [] },
        student: studentId, // Ensure outstanding payments belong to this student
        status: { $ne: 'paid' }
      })
    ]);
    
    // Validate payment types
    if (paymentTypeIds?.length > 0) {
      if (paymentTypes.length !== paymentTypeIds.length) {
        const missingPaymentTypes = paymentTypeIds.filter(id => 
          !paymentTypes.some(pt => pt._id.equals(id))
        );
        return res.status(400).json({ 
          message: 'Invalid payment type(s)',
          details: {
            expected: paymentTypeIds.length,
            found: paymentTypes.length,
            missingIds: missingPaymentTypes
          }
        });
      }
    }
    
    // Validate outstanding payments
    if (outstandingIds?.length > 0) {
      if (outstandingPayments.length !== outstandingIds.length) {
        const missingOutstanding = outstandingIds.filter(id => 
          !outstandingPayments.some(op => op._id.equals(id))
        );
        
        // Check if any outstanding payments exist but are already paid or belong to another student
        const existingButInvalid = await OutstandingPayment.find({
          _id: { $in: outstandingIds },
          $or: [
            { status: 'paid' },
            { student: { $ne: studentId } }
          ]
        });
        
        return res.status(400).json({ 
          message: 'Invalid outstanding payment(s)',
          details: {
            totalRequested: outstandingIds.length,
            validFound: outstandingPayments.length,
            missingIds: missingOutstanding,
            invalidReasons: existingButInvalid.map(payment => ({
              id: payment._id,
              reason: payment.status === 'paid' ? 'Already paid' : 'Belongs to another student'
            }))
          }
        });
      }
    }
    
    // Calculate total amount
    const totalAmount = [
      ...paymentTypes.map(pt => pt.amount),
      ...outstandingPayments.map(op => op.amountDue)
    ].reduce((sum, amount) => sum + amount, 0);
    
    // Check wallet balance
    if (wallet.balance < totalAmount) {
      return res.status(400).json({ 
        message: 'Insufficient wallet balance',
        requiredAmount: totalAmount,
        currentBalance: wallet.balance,
        difference: totalAmount - wallet.balance
      });
    }
    
    const reference = generateReference();
    
    // Create debit transaction
    const debitTransaction = new Transaction({
      wallet: wallet._id,
      amount: totalAmount,
      type: 'debit',
      reference,
      status: 'successful',
      description: 'School fees payment including outstanding',
      student: studentId
    });
    
    await debitTransaction.save();
    
    // Update wallet balance
    wallet.balance -= totalAmount;
    wallet.transactions.push(debitTransaction._id);
    await wallet.save();
    
    // Create regular payment records
    const regularPayments = await Promise.all(
      paymentTypes.map(pt =>
        Payment.create({
          student: studentId,
          paymentType: pt._id,
          amount: pt.amount,
          reference,
          status: 'successful',
          paidAt: new Date(),
          transaction: debitTransaction._id,
          academicSession: pt.academicSession // Add if available
        })
      )
    );
    
    // Create outstanding payment records and mark as paid
    const outstandingPaymentRecords = await Promise.all(
      outstandingPayments.map(op =>
        Payment.create({
          student: studentId,
          paymentType: op.paymentType,
          amount: op.amountDue,
          reference,
          status: 'successful',
          isOutstandingPayment: true,
          outstandingPayment: op._id,
          paidAt: new Date(),
          transaction: debitTransaction._id,
          academicSession: op.academicSession,
          originalLevel: op.originalLevel
        })
      )
    );
    
    // Update outstanding payments status
    await OutstandingPayment.updateMany(
      { _id: { $in: outstandingPayments.map(op => op._id) } },
      { 
        $set: {
          status: 'paid',
          amountPaid: outstandingPayments.reduce((acc, op) => acc + op.amountDue, 0),
          paymentDate: new Date(),
          updatedAt: new Date(),
          paymentReference: reference
        }
      }
    );
    
    res.status(200).json({
      message: 'Payment successful including outstanding debts',
      reference,
      totalAmount,
      newBalance: wallet.balance,
      regularPaymentIds: regularPayments.map(p => p._id),
      outstandingPaymentIds: outstandingPaymentRecords.map(p => p._id),
      transactionId: debitTransaction._id,
      timestamp: new Date()
    });
    
  } catch (error) {
    console.error('Payment with outstanding error:', error);
    res.status(500).json({ 
      message: 'Payment processing failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};




const getAllWallets = async (req, res) => {
    try {
      const { sortBy = 'createdAt', sortOrder = 'desc', minBalance, maxBalance } = req.query;
      
      // 1. Build the wallet query
      const query = {};
      if (minBalance !== undefined && minBalance !== '') {
        query.balance = { $gte: Number(minBalance) };
      }
      if (maxBalance !== undefined && maxBalance !== '') {
        query.balance = { $lte: Number(maxBalance) };
      }
  
      // 2. Get wallets with transactions
      const wallets = await Wallet.find(query)
        .populate('transactions')
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 });
  
      // 3. Get student details
      const studentIds = [...new Set(wallets.map(w => w.student.toString()))];
      
      if (studentIds.length > 0) {
        const studentsResponse = await axios.get('http://localhost:5007/user/api/student/batch', {
          params: { ids: studentIds.join(',') }
        });
  
        // Convert response to array and create mapping
        const studentsArray = Array.isArray(studentsResponse.data) 
          ? studentsResponse.data 
          : [studentsResponse.data].filter(Boolean);
  
        const studentMap = studentsArray.reduce((map, student) => {
          map[student.studentID] = student; // Note: using studentID instead of _id
          return map;
        }, {});
  
        // 4. Combine the data
        const enrichedWallets = wallets.map(wallet => ({
          ...wallet.toObject(),
          student: studentMap[wallet.student] || {
            studentID: wallet.student,
            error: "Student details not available"
          }
        }));
  
        res.json(enrichedWallets);
      } else {
        res.json(wallets);
      }
      
    } catch (error) {
      console.error('Wallet error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process wallets',
        error: error.message
      });
    }
  };
  
  // Admin: Get wallet by student ID
  const getWalletByStudentId = async (req, res) => {
    try {
      const { studentId } = req.params;
      
      const wallet = await Wallet.findOne({ student: studentId })
        .populate({
          path: 'student',
          select: 'firstName lastName email admissionNumber'
        })
        .populate({
          path: 'transactions',
          options: { sort: { createdAt: -1 } }
        });
      
      if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found' });
      }
      
      res.json(wallet);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

const getAllTransactions = async (req, res) => {
  try {
    const { 
      type, 
      status, 
      startDate, 
      endDate, 
      studentId,
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (studentId) {
      const wallet = await Wallet.findOne({ student: studentId });
      if (wallet) {
        query.wallet = wallet._id;
      } else {
        return res.json([]);
      }
    }

    // Get transactions with wallet and payment type
    const transactions = await Transaction.find(query)
      .populate('wallet')
      .populate('paymentType')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Get all wallet IDs from transactions
    const walletIds = transactions
      .map(t => t.wallet?._id?.toString())
      .filter(id => id);

    // Get wallets with their student references
    const wallets = await Wallet.find({ _id: { $in: walletIds } }).select('student');

    // Create a map of wallet ID to student ID
    const walletToStudentMap = {};
    wallets.forEach(wallet => {
      if (wallet.student) {
        walletToStudentMap[wallet._id.toString()] = wallet.student.toString();
      }
    });

    // Get unique student MongoDB IDs
    const studentMongoIds = [...new Set(Object.values(walletToStudentMap))];

    console.log('Student MongoDB IDs from wallets:', studentMongoIds);

    // Get student details using studentID field (not _id)
    let studentDetailsMap = {};

    if (studentMongoIds.length > 0) {
      try {
        // First get all students that match these studentIDs
        const studentResponse = await axios.get('http://localhost:5007/user/api/student/batch-by-studentid', {
          params: { studentIds: studentMongoIds.join(',') }
        });

        // Create a map of student.studentID to student details
        const students = Array.isArray(studentResponse.data) 
          ? studentResponse.data 
          : [studentResponse.data].filter(Boolean);

        students.forEach(student => {
          if (student && student.studentID) {
            studentDetailsMap[student.studentID] = {
              _id: student._id,
              studentID: student.studentID,
              firstName: student.firstName,
              lastName: student.lastName,
              middleName: student.middleName,
              admissionNumber: student.admissionNumber,
              fullName: `${student.firstName || ''} ${student.middleName || ''} ${student.lastName || ''}`.trim()
            };
          }
        });

        console.log('Student details map:', studentDetailsMap);
      } catch (error) {
        console.error('Failed to fetch student details:', error.message);
      }
    }

    // Enrich transactions with student data
    const enrichedTransactions = transactions.map(transaction => {
      const transactionObj = transaction.toObject();
      
      if (transactionObj.wallet && transactionObj.wallet._id) {
        const walletId = transactionObj.wallet._id.toString();
        const studentId = walletToStudentMap[walletId];
        
        if (studentId && studentDetailsMap[studentId]) {
          transactionObj.wallet.student = studentDetailsMap[studentId];
        } else {
          transactionObj.wallet.student = {
            _id: studentId || 'unknown',
            error: "Student details not available"
          };
        }
      }

      return transactionObj;
    });

    const total = await Transaction.countDocuments(query);
    res.set('X-Total-Count', total);
    res.json(enrichedTransactions);

  } catch (error) {
    console.error('Transaction fetch error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message 
    });
  }
};

module.exports = {
    getAllTransactions
    // ... other controller methods
};


// Admin: Adjust wallet balance (credit/debit)
const adjustWalletBalance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { amount, description, type } = req.body;
    console.log(studentId)
    
    if (!['credit', 'debit'].includes(type)) {
      return res.status(400).json({ message: 'Invalid transaction type' });
    }
    
    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }
    
    // Find or create wallet in one operation
    let wallet = await Wallet.findOneAndUpdate(
      { student: studentId },
      { $setOnInsert: { student: studentId, balance: 0, transactions: [] } },
      { 
        upsert: true,
        new: true,
        setDefaultsOnInsert: true 
      }
    ).populate('student', 'firstName lastName admissionNumber');
    
    // Check for sufficient balance if debit
    if (type === 'debit' && wallet.balance < amount) {
      return res.status(400).json({ 
        message: 'Insufficient wallet balance',
        currentBalance: wallet.balance,
        requiredAmount: amount
      });
    }
    
    const reference = generateReference();
    const transaction = new Transaction({
      wallet: wallet._id,
      amount,
      type,
      reference,
      status: 'successful',
      description: description || `Admin ${type}`,
      adminInitiated: true
    });
    
    await transaction.save();
    
    // Update wallet balance
    if (type === 'credit') {
      wallet.balance += amount;
    } else {
      wallet.balance -= amount;
    }
    
    wallet.transactions.push(transaction._id);
    await wallet.save();
    
    res.json({
      message: `Wallet ${type} successful`,
      newBalance: wallet.balance,
      transaction,
      student: wallet.student
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    verifyFlutterwavePayment,
  getWalletBalance,
  payFromWalletWithOutstanding, // Add this
  fundWallet,
  payFromWallet,
    getWalletTransactions,
    getAllWallets,
  getWalletByStudentId,
  getAllTransactions,
  adjustWalletBalance
};