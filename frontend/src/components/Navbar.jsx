import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Navbar = ({ isAuth, setAuth }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(false);
  };

  return (
    <nav className="crazy-navbar flex justify-between items-center p-6">
      <div className="crazy-navbar-brand text-3xl font-bold text-white">
        <Link to="/">MyApp</Link>
      </div>
      <div className="crazy-navbar-links space-x-6">
        <Link to="/" className="crazy-link">Home</Link>
        {!isAuth ? (
          <>
            <Link to="/login" className="crazy-link">Login</Link>
            <Link to="/register" className="crazy-link">Register</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="crazy-link">Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
