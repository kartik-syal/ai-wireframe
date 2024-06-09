import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      {user ? (
        <>
          <h1>Welcome, {user.username}</h1>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <h1>Please log in</h1>
      )}
    </div>
  );
};

export default Home;
