import { useState, useContext } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../SharedNav/Footer';
import TopNav from '../SharedNav/Topvabae';
import Navbar from '../SharedNav/Navbar';

const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (!email.includes('@')) {
      errors.email = 'Enter a valid email address.';
    }
    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const userData = await loginUser(email, password);
      if (userData) {
        toast.success('Login successful! Redirecting...', {
          position: "top-center",
          autoClose: 1000,
          onClose: () => {
            // Navigation happens after toast closes
            if (userData.role === 'student') {
              navigate('/admin');
            } else if (userData.role === 'teacher') {
              navigate('/Staff');
            }
            else if (userData.role === 'Account') {
              navigate('/Account');
            } else if (userData.role === 'sadmin') {
              navigate('/Sadmin');
            }
          }
        });
      }
    } catch (err) {
      const errorResponse = err.response?.data;
      
      if (errorResponse?.errorType === 'EMAIL_NOT_FOUND') {
        toast.error('This email is not registered. Please check your email.', {
          position: "top-center",
          autoClose: 5000,
        });
      } else if (errorResponse?.errorType === 'INCORRECT_PASSWORD') {
        toast.error('The password you entered is incorrect. Please try again.', {
          position: "top-center",
          autoClose: 5000,
        });
      } else if (err.response?.status === 500) {
        toast.error('Our servers are busy. Please try again later.', {
          position: "top-center"
        });
      } else if (err.code === 'ERR_NETWORK') {
        toast.error('Network connection failed. Please check your internet.', {
          position: "top-center"
        });
      } else {
        toast.error('Login failed. Please try again.', {
          position: "top-center"
        });
      }
      
      console.error('Login error:', errorResponse || err);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="shadow-lg"
      />
      
      <TopNav />
      <Navbar />
      
      <div className="flex flex-col items-center justify-center pt-20 pb-12 px-4">
        <motion.div
          className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center text-itccolor">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <motion.div whileFocus={{ scale: 1.02 }} className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-itccolor"
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
              )}
            </motion.div>

            {/* Password Input */}
            <motion.div whileFocus={{ scale: 1.02 }} className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-itccolor"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {validationErrors.password && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
              )}
            </motion.div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 rounded-lg font-semibold text-lg text-white transition duration-300 ${
                isLoading
                  ? 'bg-itccolor/70 cursor-not-allowed'
                  : 'bg-itccolor hover:bg-green-700'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" /> Logging in...
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="flex justify-between text-sm">
            <button 
              onClick={() => navigate('/forgot-password')}
              className="text-itccolor hover:underline"
            >
              Forgot password?
            </button>
            <span className="text-gray-500">
              No account?{' '}
              <Link to="/#yy" className="text-itccolor hover:underline">
                Contact admin
              </Link>
            </span>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;