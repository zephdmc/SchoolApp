import axios from 'axios';

const API_URL = '/fee/api/fee';

// Payment Types
const createPaymentType = async (paymentTypeData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.post(`${API_URL}/types`, paymentTypeData, config);
  return response.data;
};

const getPaymentTypes = async () => {
  const response = await axios.get(`${API_URL}/types`);
  return response.data;
};

// Payments
const getAllPayments = async () => {

  const response = await axios.get(`${API_URL}/all`);
  return response.data;
};

const getStudentPaymentsDue = async (userId) => {
  const response = await axios.get(`${API_URL}/due/${userId}`);
  return response.data;
};

const initiatePayment = async (paymentTypeIds, userId) => {

  const response = await axios.post(`${API_URL}/initiate`, { paymentTypeIds, userId},);
  return response.data;
};

const verifyPayment = async (reference) => {
  const response = await axios.get(`${API_URL}/verify/${reference}`);
  return response.data;
};

const getStudentPaidPayments = async (studentId) => {
  const res = await axios.get(`${API_URL}/status/${studentId}`);
  return res.data;
};


const paymentService = {
  createPaymentType,
  getPaymentTypes,
  getAllPayments,
  getStudentPaymentsDue,
  initiatePayment,
  verifyPayment,
  getStudentPaidPayments
};

export default paymentService;