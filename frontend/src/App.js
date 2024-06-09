import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
