import axios from 'axios';

const API_URL = 'http://localhost:5000/api/results';

export const fetchStudentsOrResults = async (classId, subjectId, sessionId) => {
    const response = await axios.get(`${API_URL}/fetch`, { params: { classId, subjectId, sessionId } });
    return response.data;
};

export const submitResults = async (data) => {
    return await axios.post(`${API_URL}/submit`, data);
};

export const updateResults = async (data) => {
    return await axios.put(`${API_URL}/update`, data);
};


// Fetch results by class and subject
export const getResultsByClassAndSubject = async (classSelected, subjectSelected) => {
    try {
      const response = await axios.get(`${API_URL}/results`, {
        params: { class: classSelected, subject: subjectSelected }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching results:", error);
      throw error;
    }
  };
  
  // import axios from 'axios';

  // const API_URL = 'http://localhost:5000/api/results';
  
