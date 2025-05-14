// // import React, { createContext, useState, useEffect, useContext } from 'react';
// // import { useNavigate } from 'react-router-dom';

// // // Create the AuthContext
// // const AuthContext = createContext();

// // // Custom hook to use the AuthContext
// // export const useAuth = () => useContext(AuthContext);

// // export const AuthProvider = ({ children }) => {
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const navigate = useNavigate();

// //   // Simulate fetching user data on component mount
// //   useEffect(() => {
// //     const fetchUser = async () => {
// //       try {
// //         // Simulate an API call to fetch user data
// //         const userData = await simulateFetchUser();
// //         setUser(userData);
// //       } catch (err) {
// //         setError('Failed to fetch user data');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchUser();
// //   }, []);

// //   const login = async (email, password) => {
// //     setLoading(true);
// //     try {
// //       // Simulate a login API call
// //       const userData = await simulateLogin(email, password);
// //       setUser(userData);
// //       navigate('/dashboard'); // Redirect to dashboard on successful login
// //     } catch (err) {
// //       setError('Invalid credentials');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const logout = () => {
// //     setUser(null);
// //     navigate('/login'); // Redirect to login on logout
// //   };

// //   const value = {
// //     user,
// //     loading,
// //     error,
// //     login,
// //     logout,
// //   };

// //   return (
// //     <AuthContext.Provider value={value}>
// //       {!loading && children}
// //     </AuthContext.Provider>
// //   );
// // };

// // // Simulated functions for demonstration purposes
// // const simulateFetchUser = () =>
// //   new Promise((resolve) => {
// //     setTimeout(() => {
// //       resolve({ id: 1, name: 'John Doe', email: 'john@example.com' });
// //     }, 1000);
// //   });

// // const simulateLogin = (email, password) =>
// //   new Promise((resolve, reject) => {
// //     setTimeout(() => {
// //       if (email === 'john@example.com' && password === 'password') {
// //         resolve({ id: 1, name: 'John Doe', email: 'john@example.com' });
// //       } else {
// //         reject(new Error('Invalid credentials'));
// //       }
// //     }, 1000);
// //   });




// import React, { createContext, useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';

// // Create the AuthContext
// const AuthContext = createContext();

// // Custom hook to use the AuthContext
// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // Simulate fetching user data on component mount
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const userData = await simulateFetchUser();
//         setUser(userData);
//       } catch (err) {
//         setError('Failed to fetch user data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   const login = async (email, password) => {
//     setLoading(true);
//     try {
//       const userData = await simulateLogin(email, password);
//       setUser(userData);
//       navigate('/dashboard');
//     } catch (err) {
//       setError('Invalid credentials');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (username, email, password) => {
//     setLoading(true);
//     try {
//       const userData = await simulateRegister(username, email, password);
//       setUser(userData);
//       navigate('/dashboard');
//     } catch (err) {
//       setError('Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     navigate('/login');
//   };

//   const value = {
//     user,
//     loading,
//     error,
//     login,
//     register, // Provide register function
//     logout,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// // Simulated functions for demonstration purposes
// const simulateFetchUser = () =>
//   new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({ id: 1, name: 'John Doe', email: 'john@example.com' });
//     }, 1000);
//   });

// const simulateLogin = (email, password) =>
//   new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (email === 'john@example.com' && password === 'password') {
//         resolve({ id: 1, name: 'John Doe', email: 'john@example.com' });
//       } else {
//         reject(new Error('Invalid credentials'));
//       }
//     }, 1000);
//   });

// const simulateRegister = (username, email, password) =>
//   new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (username && email && password) {
//         resolve({ id: 2, name: username, email });
//       } else {
//         reject(new Error('Registration failed'));
//       }
//     }, 1000);
//   });




