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
  console.log(response,'rt')
  return response.data;
};

export const getPaymentTypeById = async (id) => {
  console.log(id)
  const response = await axios.get(`${API_URL}/spayType/${id}`);
  console.log(response)
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

export const getStudentPaidPayment = async (id) => {
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

// const getStudentOutstandingPayments = async (studentId) => {
//   try {
//     const response = await axios.get(`/fee/api/fee/outstanding/${studentId}`);
//     console.log(response.data.data);
//     return response.data.data;
//   } catch (error) {
//     throw error.response?.data || error;
//   }
// };

export const getPaymentTypeses = async () => {
  try {
    const response = await axios.get(`${API_URL}/payment/types`);
    console.log(response, "eer")
    // Handle different response formats
    if (Array.isArray(response.data)) {
      return response.data; // Direct array response
    } else if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data; // { data: [...] } format
    } else if (Array.isArray(response.data.paymentTypes)) {
      return response.data.paymentTypes; // { paymentTypes: [...] } format
    } else {
      console.warn('Unexpected payment types response format:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching payment types:', error);
    throw error;
  }
};

// Get payments by payment type
export const getPaymentsByPaymentType = async (paymentTypeId, filters = {}) => {
  try {
    const { page = 1, limit = 10, status } = filters;
    const params = new URLSearchParams({ page, limit });
    
    if (status) params.append('status', status);
    
    const response = await axios.get(
      `${API_URL}/by-payment-type/${paymentTypeId}?${params}`
    );
    
    // Handle different response formats
    let data = response.data;
    if (data.data) {
      data = data.data; // Handle { data: {...} } format
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching payments by payment type:', error);
    throw error;
  }
};




// In your paymentService.getStudentOutstandingPayments method
const getStudentOutstandingPayments = async (studentId) => {
  try {
    const response = await axios.get(`/fee/api/fee/outstanding/${studentId}`);
    return response.data; // This should be { success: true, studentId: ..., data: [...] }
  } catch (error) {
    console.error('Error fetching outstanding payments:', error);
    throw error;
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
  getStudentPaidPayment
};

export default paymentService;