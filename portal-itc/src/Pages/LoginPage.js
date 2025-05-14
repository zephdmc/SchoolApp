import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider'; // Correct import

const LoginPage = () => {
  const { login, error } = useAuth(); // Use login from context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password); // Call login from context
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
      {error && <p>{error}</p>} {/* Display error if present */}
    </form>
  );
};


export default LoginPage;
