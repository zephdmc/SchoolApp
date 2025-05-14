import axios from 'axios';

const API_URL = '/user/api/student';

// Create a new student
export const createStudent = async (studentData) => {
  return await axios.post(API_URL, studentData);
};

// Get all students
export const getAllStudents = async () => {
  return await axios.get(API_URL);
};

// Get student by ID
export const getStudentById = async (id) => {
  return await axios.get(`${API_URL}/${id}`);
};

// Update student
export const updateStudent = async (id, studentData) => {
  return await axios.put(`${API_URL}/${id}`, studentData);
};

// Delete student
export const deleteStudent = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};

// Fetch students by class
export const getStudentsByClass = async (className) => {
  console.log(className)
  const response = await axios.get(`${API_URL}/class/${className}`);
  return response.data
};

export const fetchStudentByID = async (studentID) => {
    try {
        const response = await axios.get(`${API_URL}/students/${studentID}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching student:', error);
        throw error;
    }
};

export const getStudentByAdmission = async (admissionNumber) => {
  try {
    const response = await axios.get(`${API_URL}/admission/${admissionNumber}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to get student ID');
    }
    throw new Error('Network error. Please try again.');
  }
};