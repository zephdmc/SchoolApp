import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Our Application
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          This is the homepage of our React application. Navigate through the app using the links below.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/login" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Login
          </Link>
          <Link to="/register" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Register
          </Link>
          <Link to="/profile" className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
            Profile
          </Link>
          <Link to="/admin" className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Admin Panel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
