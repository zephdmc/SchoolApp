import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAllClasses } from "../../services/ClassService";
import { getStudentByAdmission } from '../../services/studentService';
import { motion, AnimatePresence } from 'framer-motion';

const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: "linear",
    },
  },
};

const toastVariants = {
  initial: { y: -50, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -50, opacity: 0 },
};

const PaymentVerification = () => {
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [studentID, setStudentID] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [classes, setClasses] = useState([]);
  const [toast, setToast] = useState({ message: '', type: '' });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await getAllClasses();
        const classArray = Array.isArray(response) ? response : response.data || [];
        setClasses(classArray);
      } catch (err) {
        console.error("Failed to fetch classes", err);
      }
    };
    fetchClasses();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };

  const handleSearch = async () => {
    if (!admissionNumber || !studentClass) {
      setError('Please enter both Admission Number and Class');
      showToast('Admission number and class are required', 'error');
      return;
    }

    setLoading(true);
    setError('');
    setPaymentStatus([]);

    try {
      const id = await getStudentByAdmission(admissionNumber);
      setStudentID(id.studentID);

      const response = await axios.get(`/fee/api/fee/payments/status/${id.studentID}/${studentClass}`);
      const data = Array.isArray(response.data) ? response.data : [];
      setPaymentStatus(data);

      showToast('Payment status loaded successfully!', 'success');
    } catch (err) {
      setError(err.message || 'Failed to fetch payment status');
      showToast('Failed to fetch payment data', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-lg relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">🔍 Verify Student Payment</h2>

      <div className="space-y-5">
        <div>
          <input
            type="text"
            placeholder="Enter Admission Number"
            value={admissionNumber}
            onChange={(e) => setAdmissionNumber(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <select
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Choose Class --</option>
            {Array.isArray(classes) && classes.map((cls, index) => (
              <option key={index} value={cls._id}>{cls.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full bg-itccolor hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 disabled:opacity-50"
        >
          {loading ? (
            <motion.div
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
              variants={spinnerVariants}
              animate="animate"
            />
          ) : 'Check Payment Status'}
        </button>
      </div>

      <AnimatePresence>
        {toast.message && (
          <motion.div
            className={`absolute top-4 right-4 z-50 px-4 py-2 rounded shadow-md text-white ${
              toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
            variants={toastVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="text-red-600 text-sm mt-4 text-center">{error}</p>}

      <AnimatePresence>
        {paymentStatus.length > 0 && (
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ul className="space-y-3">
              {paymentStatus.map((status, index) => (
                <motion.li
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-md border hover:shadow transition"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <span className="font-medium text-gray-700">{status.paymentType}</span>
                  <span className={`text-sm font-bold ${status.status === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
                    {status.status}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PaymentVerification;
