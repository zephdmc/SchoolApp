import axios from "axios";

const API_URL = "/result/api/examcomputation/";

export const getAllComputations = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createComputation = async (data) => {
    console.log(data)
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updateComputation = async (id, updatedData) => {
  const response = await axios.put(`${API_URL}${id}`, updatedData);
  return response.data;
};

export const deleteComputation = async (id) => {
  await axios.delete(`${API_URL}${id}`);
};

// export const getSubjectsByTeacher = async (teacherId) => {
//   console.log(teacherId)
//     const response = await axios.get(`${API_URL}/by-teacher?teacherId=${teacherId}`);
//     return response.data;
// };


// export const getSubjectWithName = async (name) => {
//   console.log(name)
//   try {
//     const response = await axios.get(`${API_URL}/${name}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching subject:", error);
//     throw error;
//   }
// };
// // export default { getSubjects, createSubject };
