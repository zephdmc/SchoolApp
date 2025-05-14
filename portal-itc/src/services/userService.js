import axios from 'axios';

export const getUserProfile = async (token) => {
  // const response = await axios.get(`${API_URL}/api/users/profile`, {
    const response = await axios.get(`/user/api/users/profile`, {

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateUserProfile = async (token, updateData) => {
  // const response = await axios.put(`${API_URL}/api/users/profile`, updateData, {
 const response = await axios.put(`/user/api/users/profile`, updateData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getAllUsers = async (token) => {
  // const response = await axios.get(`${API_URL}/api/users/all`, {
    const response = await axios.get(`/user/api/users/all`, {

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteUser = async (token, userId) => {
  const response = await axios.delete(`/user/api/users/${userId}`, {
    // const response = await axios.delete(`${API_URL}/api/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Function to update enroll
export const updateEnroll = async (userId) => {
  try {
    const response = await axios.put(`/user/api/users/users/${userId}/enroll`);
    return response;
  } catch (error) {
    console.error('Error updating enroll:', error.response?.data || error.message);
    throw error;
  }
};

// Function to get students where Enroll is null
export const getAllUsersNotEnroll = async (token) => {
  try {
    
    const response = await axios.get('/user/api/users/students/enroll-null', {

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response, "getallusersnotenrolled")
    return response;
  } catch (error) {
    console.error('Error fetching students:', error.response?.data || error.message);
    throw error;
  }
};


// Function to get students where Enroll is null
export const getAllTeachersUsersNotEnroll = async (token) => {
  try {
    
    const response = await axios.get('/user/api/users/teachers/enroll-null', {

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.teachers;
  } catch (error) {
    console.error('Error fetching students:', error.response?.data || error.message);
    throw error;
  }
};

// Function to update enroll
export const updateEnrollTeacher = async (userId) => {
  try {
    const response = await axios.put(`/user/api/users/users/${userId}/enrollTeacher`);
    return response.data;
  } catch (error) {
    console.error('Error updating enroll:', error.response?.data || error.message);
    throw error;
  }
};