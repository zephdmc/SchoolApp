import { useState, useContext } from 'react';
import { FaEnvelope, FaLock, FaExclamationTriangle, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
import AuthContext from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Footer from '../SharedNav/Footer';
import TopNav from '../SharedNav/Topvabae';
import Navbar from '../SharedNav/Navbar';

const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
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
    setError('');
    const errors = validateForm();
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    try {
      await loginUser(email, password);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white">
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

          {error && (
            <motion.div
              className="bg-red-100 text-red-700 p-3 rounded-md flex items-center gap-2 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <FaExclamationTriangle /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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

          <p className="text-sm text-center text-gray-500">
            Don't have an account?{' '}
            <Link to="/#" className="text-itccolor hover:underline font-medium">
              Contact the Admin
            </Link>
          </p>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;