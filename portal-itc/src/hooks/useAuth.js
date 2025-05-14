// import { useState, useEffect, useContext, createContext } from 'react';
// import { loginUser, logoutUser, fetchUser } from '../api/authApi';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const auth = useAuthProvider();
//   return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// const useAuthProvider = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const data = await fetchUser();
//         setUser(data);
//       } catch (err) {
//         setError('Failed to load user data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadUser();
//   }, []);

//   const login = async (email, password) => {
//     setLoading(true);
//     try {
//       const data = await loginUser(email, password);
//       setUser(data);
//       setError('');
//     } catch (err) {
//       setError('Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     setLoading(true);
//     try {
//       await logoutUser();
//       setUser(null);
//       setError('');
//     } catch (err) {
//       setError('Logout failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     user,
//     loading,
//     error,
//     login,
//     logout,
//   };
// };


import { useContext } from 'react';
import AuthContext from '../context/AuthContext'; // Adjust the import path

export const useAuth = () => {
  return useContext(AuthContext);
};