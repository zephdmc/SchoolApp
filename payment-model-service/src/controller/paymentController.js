const Payment = require('../models/Payment');
const PaymentType = require('../models/PaymentType');

// const User = require('../models/User');
const { generateReference } = require('../services/helpers');
const axios = require('axios');

// Admin: Create payment type
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
      .populate('student paymentType')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student: Get payments due
const getStudentPaymentsDue = async (req, res) => {
  try {
    const { id } = req.params;
    // const student = await User.findById(id);
    const paymentTypes = await PaymentType.find({
      level: id,
      isActive: true
    });

    const paymentsMade = await Payment.find({
      student: id,
      status: 'successful'
    }).populate('paymentType');

    const paymentsDue = paymentTypes.filter(
      pt => !paymentsMade.some(pm => pm.paymentType._id.equals(pt._id))
    ).map(pt => ({
      _id: pt._id,
      name: pt.name,
      description: pt.description,
      amount: pt.amount,
      dueDate: pt.dueDate
    }));

    res.json(paymentsDue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // Student: Initiate payment
// const initiatePayment = async (req, res) => {
//   try {
//     const { paymentTypeIds, userId  } = req.body;
//     // const student = await User.findById(req.user.id);
//     console.log('prada', paymentTypeIds)
//     console.log('pradra', userId )

//     const paymentTypes = await PaymentType.find({
//       _id: { $in: paymentTypeIds }
//     });
//     console.log('paymentTypes', paymentTypes )

//     if (paymentTypes.length !== paymentTypeIds.length) {
//       return res.status(400).json({ message: 'Invalid payment type(s)' });
//     }

//     const totalAmount = paymentTypes.reduce((sum, pt) => sum + pt.amount, 0);
//     console.log('totalAmount', totalAmount )

//     const reference = generateReference();

//     const payments = await Promise.all(paymentTypes.map(pt =>
//       Payment.create({
//         student: userId ,
//         paymentType: pt._id,
//         amount: pt.amount,
//         reference,
//         status: 'pending'
//       })
//     ));

//     const opayResponse = await axios.post('https://api.opaycheckout.com/v1/payment', {
//       amount: totalAmount * 100,
//       reference,
//       // email: userId ,
//       callback_url: `${process.env.FRONTEND_URL}/payment/verify`,
//       metadata: {
//         studentId: userId ,
//         paymentIds: payments.map(p => p._id)
//       }
//     }, {
//       headers: {
//         Authorization: `Bearer ${process.env.OPAY_SECRET_KEY}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     res.json({
//       paymentUrl: opayResponse.data.data.authorization_url,
//       reference,
//       totalAmount
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };




// Student: Initiate payment (Test mode - no OPay)
const initiatePayment = async (req, res) => {
  try {
    const { paymentTypeIds, userId } = req.body;

 

    // Find all selected payment types
    const paymentTypes = await PaymentType.find({
      _id: { $in: paymentTypeIds }
    });

    if (paymentTypes.length !== paymentTypeIds.length) {
      return res.status(400).json({ message: 'Invalid payment type(s)' });
    }

    const totalAmount = paymentTypes.reduce((sum, pt) => sum + pt.amount, 0);
    const reference = generateReference();

    // Simulate "successful" payments by saving as status: 'successful'
    const payments = await Promise.all(paymentTypes.map(pt =>
      Payment.create({
        student: userId,
        paymentType: pt._id,
        amount: pt.amount,
        reference,
        status: 'successful', // Simulate immediate success
        paidAt: new Date() // Optional field if tracking time of payment
      })
    ));

    // Send simulated success response
    res.json({
      message: 'Payment simulated successfully',
      reference,
      totalAmount,
      paymentIds: payments.map(p => p._id),
      status: 'successful'
    });

  } catch (error) {
    console.error('Payment Error:', error);
    res.status(500).json({ message: error.message });
  }
};


// Verify payment
const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const opayResponse = await axios.get(`https://api.opaycheckout.com/v1/payment/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.OPAY_SECRET_KEY}`
      }
    });

    if (opayResponse.data.data.status === 'success') {
      await Payment.updateMany(
        { reference },
        { status: 'successful', verified: true }
      );

      return res.json({ message: 'Payment verified successfully' });
    }

    res.status(400).json({ message: 'Payment verification failed' });
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
    }).select('paymentType status');
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({ message: 'Server error fetching payment status' });
  }
};


const getStudentPayments = async (req, res) => {
  const { studentID, class: studentClass } = req.params;

  try {
    // const student = await axios.get(`http://localhost:5003/user/api/student/admission/${studentID}`);
    // if (!student) {
    //   return res.status(404).json({ message: 'Student not found' });
    // }

    const paymentTypes = await PaymentType.find({ level: studentClass });

    // Fetch payments for the student and populate necessary fields
    const payments = await Payment.find({ student: studentID })
      .populate('paymentType')
      .exec();

    // Map the payments to include payment type names and statuses
    const paymentDetails = paymentTypes.map(paymentType => {
      const payment = payments.find(p => p.paymentType._id.toString() === paymentType._id.toString());
      return {
        paymentType: paymentType.name,
        status: payment ? payment.status : 'Not Paid',
      };
    });

    res.json(paymentDetails);
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
  getStudentPayments
};


