import axios from "axios";

const API_URL = "/academic/api/subjects";

export const getAllSubject = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createSubject = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updateSubject = async (id, updatedData) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedData);
  return response.data;
};

export const deleteSubject = async (id) => {
  await axios.delete(`${API_URL}${id}`);
};

export const getSubjectsByTeacher = async (teacherId) => {
  if (!teacherId) {
      console.error('No teacherId provided');
      throw new Error('Teacher ID is required');
  }
  
  try {
      
      const response = await axios.get(`${API_URL}/by-teacher`, {
          params: { teacherId }
      });
      return response.data;
  } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
  }
};

export const getSubjectWithName = async (name) => {

  try {
    const response = await axios.get(`${API_URL}/${name}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching subject:", error);
    throw error;
  }
};

// Get student by ID
export const getSubjectById = async (id) => {
  return await axios.get(`${API_URL}/id/${id}`);
};


// export default { getSubjects, createSubject };
