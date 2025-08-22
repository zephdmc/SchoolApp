import { createContext, useState, useEffect } from 'react';
import { login, logout, register } from '../services/authService';
import { useNavigate } from 'react-router-dom';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          setUser(storedUser);
        }
        setLoading(false);
      }, []);
    
      const loginUser = async (email, password) => {
        setLoading(true);
        try {
          const data = await login(email, password);
          
          if (!data || !data.token) {
            throw new Error('Invalid response from server');
          }
      
          setUser(data);
          localStorage.setItem('token', data.token);
          
          // Return the user data for role-based navigation
          return data;
        } catch (err) {
          console.error('Login error:', err.response?.data || err);
          throw err;
        } finally {
          setLoading(false);
        }
      };

    
    
    const registerUser = async (userData) => {
      
    const data = await register(userData);
    setUser(data);
    };
    


  const logoutUser = () => {
    logout();
      setUser(null);
      navigate('/login');
  };

  
    
  return (
    <AuthContext.Provider value={{ user, loginUser, registerUser, logoutUser, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
