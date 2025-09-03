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
export const getPaymentTypeById = async (id) => {
  const response = await axios.get(`${API_URL}/paymentTypeById/${id}`);
  return response.data;
};

// Payments
const getAllPayments = async () => {

  const response = await axios.get(`${API_URL}/all`);
  return response.data;
};

// const getStudentPaymentsDue = async (userId, level) => {
//   const response = await axios.get(`${API_URL}/due/${userId}?level=${level}`);
//   return response.data;
// };

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

const getStudentPaidPayment = async (id) => {
  const res = await axios.get(`${API_URL}/spayType/${id}`);
  return res.data;
};

const getPaymentStatusForTypes = async () => {
  const response = await axios.get(`${API_URL}/status`);
  return response.data;
};

const deletePaymentType = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
const updatePaymentType = async (id, paymentTypeData) => {
  const response = await axios.put(`${API_URL}/${id}`, paymentTypeData);
  return response.data;
};

const getStudentOutstandingPayments = async (studentId) => {
  try {
    const response = await axios.get(`/fee/api/fee/outstanding/${studentId}`);
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


export const getStudentPaymentsDue = async (studentId, levelId) => {
  try {
    const response = await axios.get(`/fee/api/fee/due/${studentId}`, {
      params: { level: levelId }
    });
    return response.data || [];
  } catch (error) {
    console.error('Payment service error:', error);
    return [];
  }
};


export const checkOutstandingPayments = async (studentId, classId, termId) => {
    try {
        const response = await axios.get(`${API_URL}/outstandingPayment/${studentId}`, {
            params: { classId, termId }
        });
        return response.data;
    } catch (error) {
        console.error('Error checking outstanding payments:', error);
        throw error;
    }
};

const paymentService = {
  createPaymentType,
  getPaymentTypes,
  getAllPayments,
  getStudentPaymentsDue,
  initiatePayment,
  verifyPayment,
  getStudentPaidPayments,
  getPaymentStatusForTypes,
  deletePaymentType,
  updatePaymentType,
  getStudentOutstandingPayments,
  checkOutstandingPayments,
  getPaymentTypeById,
  getStudentPaidPayment
};

export default paymentService;