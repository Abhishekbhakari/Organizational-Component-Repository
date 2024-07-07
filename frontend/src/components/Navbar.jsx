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
      <div className="crazy-navbar-brand text-3xl  text-white font-mono font-thin drop-shadow-md ">
        <Link to="/">repo_</Link>
      </div>
      <div className=" flex crazy-navbar-links space-x-6">
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
