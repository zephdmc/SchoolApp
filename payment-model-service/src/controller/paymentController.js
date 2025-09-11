const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const PaymentType = require('../models/PaymentType');
const Wallet = require('../models/Wallet');
const OutstandingPayment = require('../models/OutstandingPayment');
const { generateReference } = require('../services/helpers');
const axios = require('axios');

require('../../../user-management-service/src/models/Student');
require('../../../academic-manager-service/src/models/Session');
require('../../../academic-manager-service/src/models/Class');

// In payment-model-service/src/controller/paymentController.js
const Student = require('../../../user-management-service/src/models/Student');

const createPaymentType = async (req, res) => {
  try {
    const { name, description, amount, dueDate, academicSession, level } = req.body;

    const paymentType = new PaymentType({
      name,
      description,
      amount,
      dueDate,
      academicSession,
      level
    });

    await paymentType.save();
    res.status(201).json(paymentType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Admin: Get all payment types
const getPaymentTypes = async (req, res) => {
  try {
    const paymentTypes = await PaymentType.find();
    res.json(paymentTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Admin: Get all payments
const getAllPayments = async (req, res) => {
  try {
    const { paymentType, status, startDate, endDate } = req.query;

    let query = {};

    if (paymentType) query.paymentType = paymentType;
    if (status) query.status = status;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const payments = await Payment.find(query)
      .populate('student paymentType transaction')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payment type by ID
// @route   GET /fee/api/fee/paymentTypeById/:id
// @access  Public
const getPaymentTypeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment type ID'
      });
    }

    const paymentType = await PaymentType.findById(id)
      .populate('academicSession', 'name')
      .populate('level', 'name');

    if (!paymentType) {
      return res.status(404).json({
        success: false,
        message: 'Payment type not found'
      });
    }

    res.status(200).json({
      success: true,
      data: paymentType
    });
  } catch (error) {
    console.error('Error fetching payment type:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payment type'
    });
  }
};


// @desc    Get student's paid payment by ID
// @route   GET /fee/api/fee/spayType/:id
// @access  Public
const getStudentPaidPayment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment ID'
      });
    }

    const payment = await Payment.findById(id)
  
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Optional: Check if payment is successful/paid
    if (payment.status !== 'successful' && !payment.verified) {
      return res.status(400).json({
        success: false,
        message: 'Payment is not completed or verified'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Error fetching student payment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payment details'
    });
  }
};


const processOverduePayments = async (req, res) => {
  try {
    // 1. Find all payment types with expired due dates
    const overduePaymentTypes = await PaymentType.find({
      dueDate: { $lt: new Date() },
      isActive: true
    });

    // 2. Get all students who should pay these (from relevant classes)
    const studentIds = await Student.distinct('_id', {
      class: { $in: overduePaymentTypes.map(pt => pt.level) },
      status: 'Active'
    });

    // 3. Find existing successful payments to exclude
    const paidPayments = await Payment.find({
      paymentType: { $in: overduePaymentTypes.map(pt => pt._id) },
      status: 'successful'
    }).select('student paymentType');

    // 4. Prepare bulk operations
    const ops = [];
    
    for (const paymentType of overduePaymentTypes) {
      for (const studentId of studentIds) {
        // Skip if payment already made
        const alreadyPaid = paidPayments.some(
          pp => pp.student.equals(studentId) && 
                pp.paymentType.equals(paymentType._id)
        );
        
        if (!alreadyPaid) {
          ops.push({
            updateOne: {
              filter: {
                student: studentId,
                paymentType: paymentType._id,
                status: 'pending'
              },
              update: {
                $setOnInsert: {
                  student: studentId,
                  paymentType: paymentType._id,
                  originalAmount: paymentType.amount,
                  amountDue: paymentType.amount,
                  name: paymentType.name,
                  description: paymentType.description,
                  originalDueDate: paymentType.dueDate,
                  academicSession: paymentType.academicSession,
                  originalLevel: paymentType.level,
                  status: 'pending'
                }
              },
              upsert: true
            }
          });
        }
      }
    }

    // 5. Execute bulk operations
    let result;
    if (ops.length > 0) {
      result = await OutstandingPayment.bulkWrite(ops);
    }

    res.json({
      message: 'Overdue payments processed',
      matched: overduePaymentTypes.length * studentIds.length,
      created: result?.upsertedCount || 0,
      duplicates: result?.matchedCount || 0,
      alreadyPaid: paidPayments.length
    });
  } catch (error) {
    console.error('Overdue payment processing error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Helper function to create outstanding payments
async function createOutstandingPaymentsForStudent(studentId, levelId) {
  try {
    // Find all active payment types for the student's current level
    const paymentTypes = await PaymentType.find({
      level: levelId,
      isActive: true
    });

    // Find payments already made by the student
    const paymentsMade = await Payment.find({
      student: studentId,
      status: 'successful'
    });

    // Identify unpaid payment types
    const unpaidPaymentTypes = paymentTypes.filter(
      pt => !paymentsMade.some(pm => pm.paymentType.equals(pt._id))
    );

    // Create outstanding payment records for unpaid types
    const outstandingPayments = await Promise.all(
      unpaidPaymentTypes.map(async pt => {
        // Check if outstanding payment already exists
        const existing = await OutstandingPayment.findOne({
          student: studentId,
          paymentType: pt._id,
          status: { $ne: 'paid' }
        });

        if (!existing) {
          return OutstandingPayment.create({
            student: studentId,
            paymentType: pt._id,
            originalAmount: pt.amount,
            amountDue: pt.amount,
            name: pt.name,
            description: pt.description,
            originalDueDate: pt.dueDate,
            academicSession: pt.academicSession,
            originalLevel: pt.level,
            status: 'pending'
          });
        }
        return existing;
      })
    );

    return outstandingPayments.filter(op => op !== null);
  } catch (error) {
    console.error('Error creating outstanding payments:', error);
    throw error;
  }
}

const getStudentOutstandingPayments = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid student ID'
      });
    }

    // 1. Find student by custom studentID
    const student = await Student.findOne({ studentID: studentId }).lean();
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    console.log(student._id.toString(), 'student _id from DB');

    // 2. Query OutstandingPayment using ObjectId directly
    const outstandingPayments = await OutstandingPayment.find({
      student: student._id,      // <-- use ObjectId, not string
      status: { $ne: 'paid' }
    })
    .populate('paymentType')
    .lean();

    res.status(200).json({
      success: true,
      studentId: student._id, // return ObjectId so frontend can match
      data: outstandingPayments
    });

  } catch (error) {
    console.error('Error fetching outstanding payments:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch outstanding payments',
      error: error.message
    });
  }
};


const getStudentPaymentsDue = async (req, res) => {
  try {
    const { id } = req.params;
    const { level } = req.query;

    // 1. Get active payment types for current level that are NOT overdue
    const currentDate = new Date();
    const paymentTypes = await PaymentType.find({ 
      level,
      isActive: true,
      dueDate: { $gte: currentDate } // Only payments that are not overdue
    }).lean();

    // 2. Get student's successful payments
    const paymentsMade = await Payment.find({ 
      student: id, 
      status: 'successful' 
    }).populate('paymentType').lean();

    // 3. Get outstanding payments (overdue payments)
    const outstandingPayments = await OutstandingPayment.find({
      student: id,
      status: { $ne: 'paid' }
    }).populate('paymentType').lean();

    // 4. Filter current pending payments (not paid, not overdue, not in outstanding)
    const currentPendingPayments = paymentTypes.filter(pt => {
      // Check if already paid
      const isPaid = paymentsMade.some(pm => 
        pm.paymentType?._id.toString() === pt._id.toString()
      );
      
      // Check if already in outstanding
      const isOutstanding = outstandingPayments.some(op => 
        op.paymentType?._id.toString() === pt._id.toString()
      );

      return !isPaid && !isOutstanding;
    }).map(pt => ({
      ...pt,
      isCurrentPending: true,
      paymentTypeId: pt._id
    }));

    // 5. Format outstanding payments
    const formattedOutstanding = outstandingPayments.map(op => ({
      ...op,
      _id: op._id,
      paymentTypeId: op.paymentType?._id,
      isOutstanding: true,
      outstandingId: op._id
    }));

    res.json({
      currentPending: currentPendingPayments,
      outstanding: formattedOutstanding
    });
  } catch (error) {
    console.error('Payment due error:', error);
    res.status(500).json({ message: 'Server error fetching payments' });
  }
};


// Update your initiatePayment function to handle outstanding payments
const initiatePayment = async (req, res) => {
  try {
    const { paymentTypeIds, userId, outstandingIds } = req.body;

    // Handle both regular and outstanding payments
    const paymentTypes = await PaymentType.find({
      _id: { $in: paymentTypeIds }
    });

    const outstandingPayments = await OutstandingPayment.find({
      _id: { $in: outstandingIds || [] }
    });

    if ((paymentTypes.length + outstandingPayments.length) !== 
        (paymentTypeIds.length + (outstandingIds?.length || 0))) {
      return res.status(400).json({ message: 'Invalid payment type(s)' });
    }

    const totalAmount = [
      ...paymentTypes.map(pt => pt.amount),
      ...outstandingPayments.map(op => op.amountDue)
    ].reduce((sum, amount) => sum + amount, 0);

    const reference = generateReference();

    // Create pending payments for regular payment types
    const regularPayments = await Promise.all(
      paymentTypes.map(pt =>
        Payment.create({
          student: userId,
          paymentType: pt._id,
          amount: pt.amount,
          reference,
          status: 'pending'
        })
      )
    );

    // Create pending payments for outstanding payments
    const outstandingPaymentRecords = await Promise.all(
      outstandingPayments.map(op =>
        Payment.create({
          student: userId,
          paymentType: op.paymentType,
          amount: op.amountDue,
          reference,
          status: 'pending',
          isOutstandingPayment: true,
          outstandingPayment: op._id
        })
      )
    );

    res.json({
      message: 'Payment initiated',
      reference,
      totalAmount,
      paymentIds: [...regularPayments, ...outstandingPaymentRecords].map(p => p._id),
      status: 'pending'
    });
  } catch (error) {
    console.error('Payment Error:', error);
    res.status(500).json({ message: error.message });
  }
};




// Update verifyPayment to handle outstanding payments
const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    // Update all payments with this reference
    await Payment.updateMany(
      { reference },
      { status: 'successful', verified: true, paidAt: new Date() }
    );

    // Get all payments that were just verified
    const verifiedPayments = await Payment.find({ reference })
      .populate('paymentType');

    // Update outstanding payment records
    await Promise.all(
      verifiedPayments.map(async payment => {
        if (payment.isOutstandingPayment && payment.outstandingPayment) {
          await OutstandingPayment.findByIdAndUpdate(
            payment.outstandingPayment,
            { status: 'paid', updatedAt: new Date() }
          );
        }
      })
    );

    return res.json({ message: 'Payment verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET: Get all successful payments for a student
const getStudentPaymentStatus = async (req, res) => {
  try {
    const { studentId } = req.params;

    const payments = await Payment.find({
      student: studentId,
      status: 'successful'
    }).populate('paymentType transaction');
    
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({ message: 'Server error fetching payment status' });
  }
};





const getStudentPayments = async (req, res) => {
  const { studentID, class: studentClass } = req.params;

  try {
    const paymentTypes = await PaymentType.find({ level: studentClass });
    const payments = await Payment.find({ student: studentID })
      .populate('paymentType transaction')
      .exec();

    const paymentDetails = paymentTypes.map(paymentType => {
      const payment = payments.find(p => p.paymentType._id.toString() === paymentType._id.toString());
      return {
        paymentType: paymentType.name,
        amount: paymentType.amount,
        status: payment ? payment.status : 'Not Paid',
        paymentDate: payment ? payment.paidAt : null,
        paymentMethod: payment?.transaction ? 'Wallet' : 'External'
      };
    });

    res.json(paymentDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// In your payment controller
const getPaymentStatusForTypes = async (req, res) => {
  try {
    const payments = await Payment.find({});
    const paymentTypeIds = [...new Set(payments.map(p => p.paymentType.toString()))];
    
    const result = paymentTypeIds.map(id => ({
      paymentTypeId: id,
      hasPayments: true
    }));
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a payment type
// @route   PUT /api/paymenttypes/:id
// @access  Private/Admin
const updatePaymentType = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if payments exist for this type
    const existingPayments = await Payment.findOne({ paymentType: id });
    if (existingPayments) {
      return res.status(400).json({ message: 'Cannot update payment type with existing payments' });
    }

    const updatedPaymentType = await PaymentType.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPaymentType) {
      return res.status(404).json({ message: 'Payment type not found' });
    }

    res.json(updatedPaymentType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a payment type
// @route   DELETE /api/paymenttypes/:id
// @access  Private/Admin
const deletePaymentType = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if payments exist for this type
    const existingPayments = await Payment.findOne({ paymentType: id });
    if (existingPayments) {
      return res.status(400).json({ message: 'Cannot delete payment type with existing payments' });
    }

    const deletedPaymentType = await PaymentType.findByIdAndDelete(id);

    if (!deletedPaymentType) {
      return res.status(404).json({ message: 'Payment type not found' });
    }

    res.json({ message: 'Payment type deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};




  
  const outstanding = async (req, res) => {

   
    try {
        const { studentId } = req.params;
      const { classId, termId } = req.query;
      
  

        const outstandingPayments = await OutstandingPayment.find({
            student: studentId,
            originalLevel: classId,
            status: { $in: ['pending', 'partially_paid'] }
        }).populate('paymentType');
        
        res.json({
            hasOutstanding: outstandingPayments.length > 0,
            outstandingPayments
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};



const getPaymentsByPaymentType = async (req, res) => {
  try {
    const { paymentTypeId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    if (!mongoose.Types.ObjectId.isValid(paymentTypeId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment type ID'
      });
    }

    const paymentType = await PaymentType.findById(paymentTypeId);
    if (!paymentType) {
      return res.status(404).json({
        success: false,
        message: 'Payment type not found'
      });
    }

    const query = { paymentType: paymentTypeId };
    if (status && ['pending', 'successful', 'failed'].includes(status)) {
      query.status = status;
    }

    // Fetch payments (sorted by latest createdAt)
    const payments = await Payment.find(query)
      .populate('paymentType', 'name amount')
      .populate('transaction', 'reference amount status')
      .sort({ createdAt: -1 }) // ✅ most recent first
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum)
      .lean()
      .exec();

    console.log('📌 Raw payments from DB:', payments);

    // Extract student keys (expected to be studentID values)
    const studentKeys = [
      ...new Set(
        payments
          .map(p => (p.student ? p.student.toString() : null))
          .filter(Boolean)
      )
    ];
    console.log('📌 Extracted student keys from payments (toString):', studentKeys);

    // Primary lookup: match payment.student -> Student.studentID
    const studentsByStudentIDList = studentKeys.length
      ? await Student.find(
          { studentID: { $in: studentKeys } },
          'firstName lastName email studentID admissionNumber'
        ).lean()
      : [];

    console.log('📌 Students fetched by studentID:', studentsByStudentIDList);

    // Build maps for fast lookup
    const studentsByStudentID = {};
    const studentsById = {};
    studentsByStudentIDList.forEach(s => {
      if (s && s.studentID) studentsByStudentID[s.studentID] = s;
      if (s && s._id) studentsById[s._id.toString()] = s;
    });

    // Fallback for missing keys (try matching ObjectId)
    const missingKeys = studentKeys.filter(k => !studentsByStudentID[k]);
    if (missingKeys.length > 0) {
      console.log(
        '⚠️ student keys not found by studentID, attempting _id fallback:',
        missingKeys
      );

      const possibleObjectIds = missingKeys.filter(k =>
        mongoose.Types.ObjectId.isValid(k)
      );
      if (possibleObjectIds.length > 0) {
        const fallbackStudents = await Student.find(
          {
            _id: {
              $in: possibleObjectIds.map(
                id => new mongoose.Types.ObjectId(id)
              )
            }
          },
          'firstName lastName email studentID admissionNumber'
        ).lean();

        console.log('📌 Students fetched by _id fallback:', fallbackStudents);

        fallbackStudents.forEach(s => {
          if (s) {
            if (s.studentID) studentsByStudentID[s.studentID] = s;
            if (s._id) studentsById[s._id.toString()] = s;
          }
        });
      }
    }

    // Map student data into payments
    const paymentsWithStudentData = payments.map(payment => {
      const key = payment.student ? payment.student.toString() : null;
      let student = key ? studentsByStudentID[key] : null;

      // fallback by _id if studentID not matched
      if (!student && key && studentsById[key]) {
        student = studentsById[key];
      }

      let studentData;
      if (student) {
        studentData = {
          _id: student._id || null,
          name:
            `${student.firstName || ''} ${student.lastName || ''}`.trim() ||
            'Unknown',
          email: student.email || '',
          studentID: student.studentID || key || '',
          admissionNumber: student.admissionNumber || ''
        };
      } else {
        studentData = {
          _id: null,
          name: 'Unknown',
          email: '',
          studentID: key || '',
          admissionNumber: ''
        };
      }

      return {
        ...payment,
        student: studentData
      };
    });

    console.log('📌 Payments after mapping student data:', paymentsWithStudentData);

    // ✅ Deduplicate: keep only latest payment per studentID
    const uniquePaymentsMap = new Map();
    paymentsWithStudentData.forEach(p => {
      if (p.student && p.student.studentID) {
        if (!uniquePaymentsMap.has(p.student.studentID)) {
          uniquePaymentsMap.set(p.student.studentID, p); // keep first (latest) occurrence
        }
      }
    });
    const uniquePayments = Array.from(uniquePaymentsMap.values());

    console.log('📌 Unique payments (deduped by studentID):', uniquePayments);

    const total = await Payment.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        payments: uniquePayments,
        paymentType: {
          _id: paymentType._id,
          name: paymentType.name,
          amount: paymentType.amount,
          description: paymentType.description
        },
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalPayments: uniquePayments.length, // ✅ reflect deduped total
          hasNext: pageNum < Math.ceil(total / limitNum),
          hasPrev: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('❌ Error fetching payments by payment type:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payments'
    });
  }
};



// ✅ Export all functions using CommonJS
module.exports = {
  createPaymentType,
  getPaymentTypes,
  getAllPayments,
  getStudentPaymentsDue,
  initiatePayment,
  verifyPayment,
  getStudentPaymentStatus,
  getStudentPayments,
  getPaymentStatusForTypes,
  updatePaymentType,
  deletePaymentType,
  processOverduePayments,
  getStudentOutstandingPayments,
  createOutstandingPaymentsForStudent,
  outstanding,
  getPaymentTypeById,
  getStudentPaidPayment,
  getPaymentsByPaymentType,
};



