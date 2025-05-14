

import React from 'react';
import { Route, Routes } from 'react-router-dom';
// import { AuthProvider } from './context/AuthProvider'; // Adjust the import path
import { AuthProvider } from './context/AuthContext'; // Adjust the import path

// import LoginPage from './Pages/LoginPage';
// import RegisterPage from './Pages/RegisterPage';
import ProfilePage from './Pages/ProfilePage';
import AdminPage from './Pages/StudentPage';
import StaffPage from './Pages/TeacherPage';
import Sadmin from './Pages/PrincipalPages';
import HomePage from './Pages/HomePage';
import PrivateRoute from './PrivateRoute';
import Login from './components/Autho/Login';
import Register from './components/Autho/Register';
import UserPage from './Pages/UserPage';
// import SearchCars from './Pages/Shared/utility/SearchCars1';
function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
        <Route path="/Sadmin" element={<PrivateRoute><Sadmin /></PrivateRoute>} />
        <Route path="/Staff" element={<PrivateRoute><StaffPage /></PrivateRoute>} />
        <Route path="/UserPage" element={<PrivateRoute><UserPage /></PrivateRoute>} />
        {/* <Route path="/Booking" element={<PrivateRoute><SearchCars /></PrivateRoute>} /> */}
        <Route path="/" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
