import axios from "axios";
const API_URL = "/academic/api/sessions/";

export const getAllSessions = async () => {
  // const response = await axios.get(API_URL);
  const response = await axios.get(`/academic/api/sessions/`);
  return response.data;
};


export const createSession = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};


export const updateSession = async (id, sessionData) => {
  const response = await fetch(`/academic/api/sessions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sessionData),
  });
  return response.json();
};


export const deleteSession = async (id) => {
  const response = await fetch(`/academic/api/sessions/${id}`, { method: 'DELETE' });
  return response.json();
};

// export default { getSessions, createSession, updateSession,  deleteSession };





// export const getAllSessions = async () => {
//   const response = await fetch('/api/sessions');
//   return response.json();
// };

// export const createSession = async (sessionData) => {
//   const response = await fetch('/api/sessions', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(sessionData),
//   });
//   return response.json();
// };


