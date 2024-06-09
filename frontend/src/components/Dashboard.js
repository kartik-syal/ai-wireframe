import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Chatbot from './Chatbot';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #ccc', background: '#f8f9fa' }}>
        <h1 style={{ margin: 0 }}>Wireframe AI</h1>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {user && <p style={{ marginRight: '20px' }}>Email: {user.email}</p>}
          <button onClick={handleLogout} style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#dc3545', color: '#fff' }}>
            Logout
          </button>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default Dashboard;
