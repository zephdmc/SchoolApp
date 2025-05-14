import axios from "axios";
// const API_URL = "/api/terms";

const API_URL = "/academic/api/terms";
export const getAllTerms = async () => {
  const response = await axios.get(API_URL);
  console.log(response, "Terms")
  return response.data;
};

export const createTerm = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updateTerm = async (id, updatedData) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedData);
  return response.data;
};

export const deleteTerm = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

