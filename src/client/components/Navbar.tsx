import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar: React.FC = () => {
  return (
    <header>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-logo">
            <Link to="/">
              <img 
                src="/assets/logo.png" 
                alt="Travel Blog Explorer Logo" 
                className="logo"
              />
            </Link>
          </div>
          <div className="navbar-links">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/login" 
              className={({ isActive }) => 
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Login
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;