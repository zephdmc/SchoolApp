import axios from 'axios';

// const API_URL = process.env.REACT_APP_USER_MANAGEMENT_API_URL;

export const login = async (email, password) => {
  const response = await axios.post(`/user/api/auth/login`, { email, password });
  if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
        // Redirect based on role
    }
    console.log(response)
  return response.data;
};

// export const register = async (userData) => {
//   console.log(userData)
//   const response = await axios.post(`/user/api/auth/register`, userData);
//   return response.data;
// };


export const register = async (userData) => {
  const { confirmPassword, ...filteredData } = userData; // Remove confirmPassword
  console.log(filteredData); // Ensure confirmPassword is removed
  const response = await axios.post(`/user/api/auth/register`, filteredData);
  return response.data;
};


// export const update = async (userData) => {
//     const response = await axios.post(`${API_URL}/api/auth/update`, userData);
//     return response.data;
//   };

export const logout = () => {
  localStorage.removeItem('user');
};

