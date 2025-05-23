import React from 'react';
import '../styles/navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-logo">
          <img 
            src="/assets/logo.png" 
            alt="Travel Blog Explorer Logo" 
            className="logo"
          />
        </div>
        <div className="navbar-links">
          <a href="/" className="nav-link">Home</a>
          <a href="/donate" className="nav-link">Donate</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;