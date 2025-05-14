import axios from 'axios';

const API_URL = '/user/api/teacher';

// Create a new student
export const createTeacher = async (TeacherData) => {
  return await axios.post(API_URL, TeacherData);
};

// Get all students
export const getAllTeachers = async () => {
  return await axios.get(API_URL);
};

// Get student by ID
export const getTeacherById = async (id) => {
  return await axios.get(`${API_URL}/${id}`);
};

// Update student
export const updateTeacher = async (id, teacherData) => {
  return await axios.put(`${API_URL}/${id}`, teacherData);
};

// Delete student
export const deleteTeacher = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};