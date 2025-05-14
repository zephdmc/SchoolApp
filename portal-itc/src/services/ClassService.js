import axios from "axios";
// const API_URL = "/api/classes";

const API_URL = "/academic/api/classes";
export const getAllClasses = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createClass = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updateClass = async (id, updatedData) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedData);
  return response.data;
};

export const deleteClass = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};


// export const updateClass = async (id, updatedData) => {
//   return await Class.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
// };

// exports.deleteClass = async (id) => {
//   return await Class.findByIdAndDelete(id);
// };