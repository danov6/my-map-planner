import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';
import { AppContext } from '../context/AppContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  console.log('Is authenticated:', isAuthenticated);
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
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="nav-link">
                  {user?.firstName || 'Profile'}
                </Link>
                <button onClick={handleLogout} className="nav-link">
                  Logout
                </button>
              </>
            ) : (
              <NavLink 
                to="/login" 
                className={({ isActive }) => 
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;