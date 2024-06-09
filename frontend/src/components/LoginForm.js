import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { login } from '../services/auth';
import { useNavigate, Link } from 'react-router-dom';
import './AuthForm.css'; // Import the CSS file

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login: loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      loginUser(response.data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Login</h2>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          <button type="submit">Login</button>
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
