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
            setUser(data);
            console.log(data.role,'Loading')
      if (data.role === 'student') {
        navigate('/admin');
      } else if (data.role === 'teacher') {
        navigate('/Staff');
          }
          else if (data.role === 'sadmin') {
            navigate('/Sadmin');
                }
        } catch (err) {
            setError('Invalid credentials');
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
