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

// // // Get outstanding payments for a student
// const getStudentOutstandingPayments = async (req, res) => {
//   try {
//     const { studentId } = req.params;
//     console.log(studentId, 'outstanding')
//     const outstandingPayments = await OutstandingPayment.find({
//       student: studentId,
//       status: { $ne: 'paid' }
//     }).populate('paymentType originalLevel academicSession');
// console.log(outstandingPayments, 'outstandingPayments')
//     res.json(outstandingPayments);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const getStudentOutstandingPayments = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Validate studentId
    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid student ID'
      });
    }
    const outstandingPayments = await OutstandingPayment.find({
      student: studentId,
      status: { $ne: 'paid' }
    })
    .populate('paymentType')
      .lean();
    

    // Always return JSON, even if empty
    res.status(200).json({
      success: true,
      data: outstandingPayments
    });

  } catch (error) {
    console.error('Error fetching outstanding payments:', error);
    // Ensure we always return JSON
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch outstanding payments',
      error: error.message
    });
  }
};


// const getStudentPaymentsDue = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { level } = req.query;

//     // 1. Get all outstanding payments first
//     const outstandingPayments = await OutstandingPayment.find({
//       student: id,
//       status: { $ne: 'paid' }
//     }).populate('paymentType').lean();

//     // 2. Get active payment types for current level
//     const paymentTypes = await PaymentType.find({ 
//       level,
//       isActive: true 
//     }).lean();

//     // 3. Get student's successful payments
//     const paymentsMade = await Payment.find({ 
//       student: id, 
//       status: 'successful' 
//     }).populate('paymentType').lean();

//  // ✅ Extract paymentType IDs from outstandingPayments safely
// const outstandingPaymentTypeIds = new Set(
//   outstandingPayments.map(op => {
//     return op.paymentType?._id
//       ? op.paymentType._id.toString()
//       : op.paymentType.toString();
//   })
// );

// const currentPendingPayments = paymentTypes
//   .filter(pt => {
//     const ptId = pt._id.toString();

//     // Check if already paid
//     const isPaid = paymentsMade.some(pm => {
//       const pmId = pm.paymentType?._id
//         ? pm.paymentType._id.toString()
//         : pm.paymentType.toString();
//       return pmId === ptId;
//     });

//     // Check if already in outstanding
//     const isOutstanding = outstandingPaymentTypeIds.has(ptId);

//     return !isPaid && !isOutstanding;
//   })
//   .map(pt => ({
//     ...pt,
//     isCurrentPending: true,
//     paymentTypeId: pt._id
//   }));


//     // Format outstanding payments
//     const formattedOutstanding = outstandingPayments.map(op => ({
//       ...op,
//       _id: op._id,
//       paymentTypeId: op.paymentType?._id,
//       isOutstanding: true,
//       outstandingId: op._id
//     }));

//     res.json({
//       currentPending: currentPendingPayments,
//       outstanding: formattedOutstanding
//     });
//   } catch (error) {
//     console.error('Payment due error:', error);
//     res.status(500).json({ message: 'Server error fetching payments' });
//   }
// };
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
// const getStudentPaymentsDue = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { level } = req.query;

//     // Get active payment types for level
//     const paymentTypes = await PaymentType.find({ 
//       level,
//       isActive: true 
//     }).lean();

//     // Get student's successful payments
//     const paymentsMade = await Payment.find({ 
//       student: id, 
//       status: 'successful' 
//     }).populate('paymentType').lean();

//     // Filter unpaid types - these are CURRENT pending payments
//     const currentPendingPayments = paymentTypes.filter(pt => 
//       !paymentsMade.some(pm => pm.paymentType?._id.toString() === pt._id.toString())
//     ).map(pt => ({
//       ...pt,
//       isCurrentPending: true, // Mark as current pending
//       paymentTypeId: pt._id
//     }));

//     // Get outstanding payments - these are from previous terms/classes
//     const outstandingPayments = await OutstandingPayment.find({
//       student: id,
//       status: { $ne: 'paid' }
//     })
//     .populate('paymentType')
//     .lean();
//     const formattedOutstanding = outstandingPayments.map(op => ({
//       ...op,
//       _id: op._id,
//       paymentTypeId: op.paymentType?._id,
//       isOutstanding: true,
//       outstandingId: op._id
//     }));

//     res.json({
//       currentPending: currentPendingPayments,
//       outstanding: formattedOutstanding
//     });
//   } catch (error) {
//     console.error('Payment due error:', error);
//     res.status(500).json({ message: 'Server error fetching payments' });
//   }
// };




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
  outstanding
};



