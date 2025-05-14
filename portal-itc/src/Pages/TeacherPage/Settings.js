import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Make sure to install react-router-dom
import AuthContext from '../../context/AuthContext';

const Logout = () => {
  const { logoutUser } = useContext(AuthContext); // Clear user data from context
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from context
    logoutUser(null);

    // Clear browser storage
    localStorage.removeItem('token'); // Example for clearing token
    sessionStorage.clear(); // Example for clearing session storage

    // Redirect to homepage
    navigate('/');
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-lg item-center rounded-lg mt-10">
    <h2 className="text-2xl font-bold mb-4 text-center">Do you want to logout</h2>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-itccolor text-white text-center item-center rounded-md shadow-lg hover:bg-orange-600"
      >
       <strong>Yes</strong> Logout
      </button>
    </div>
  );
};

export default Logout;
