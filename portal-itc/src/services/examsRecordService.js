import axios from "axios";

const API_BASE_URL = "/result/api/results"; // Change this if needed

export const getStudentsByClass = async (classSelected) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/students?class=${classSelected}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

// Fetch results by class and subject
export const getResultsByClassAndSubject = async (classSelected1, subjectSelected) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/`, {
      params: { classSelected: classSelected1, subject: subjectSelected }
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching results:", error);
    throw error;
  }
};

// export const saveResults = async (classSelected, subjectSelected, scores, teacher_id) => {
//   try {
//     await axios.post(`${API_BASE_URL}`, { class: classSelected, subject: subjectSelected, scores, teacher_id });
//     return "Results saved successfully!";
//   } catch (error) {
//     console.error("Error saving results:", error);
//     throw error;
//   }
// };




export const saveResults = async (payload) => {
  try {
    console.log(payload)
    await axios.post(`${API_BASE_URL}/save`, payload);
    return "Results saved successfully!";
  } catch (error) {
    console.error("Error saving results:", error);
    throw error;
  }
};


export const fetchStudentResults = async (studentId, classId, termId) => {
  try {
      const response = await axios.get(`${API_BASE_URL}/student/${studentId}/class/${classId}/term/${termId}`);
      return response.data;
  } catch (error) {
      console.error('Error fetching student results:', error);
      throw error;
  }
};

// Fetch students with pending results
export const fetchPendingResults = async (term_id, classSelected) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/results/pending`, {
            params: { term_id, classSelected }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching pending results:', error);
        throw error;
    }
};


export const updateResultsStatus = async (termId, classSelected, newStatus) => {
  try {
      const response = await axios.put(`${API_BASE_URL}/update-status`,
          { termId, classSelected, newStatus }
      );
      return response.data;
  } catch (error) {
      console.error('Error updating status:', error);
      throw error;
  }
};

export const fetchResults = async (data) => {
    const response = await axios.post(`${API_BASE_URL}/fetch`, data);
    return response.data;
};



