import React, { useState } from 'react';
import { signup } from '../services/auth';
import { Link } from 'react-router-dom';
import './AuthForm.css'; // Import the CSS file

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup({ username, email, password });
      alert('User registered successfully');
    } catch (error) {
      console.error('Signup failed', error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Sign Up</h2>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          <button type="submit">Sign Up</button>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
