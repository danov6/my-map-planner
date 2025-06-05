import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import '../styles/navbar.css';
import { AppContext } from '../context/AppContext';
import { useS3Image } from '../hooks/useS3Image';
import { fetchUserProfile } from '../services/users';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, setUser, logout } = useContext(AppContext);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // const { imageUrl, isLoading: isImageLoading } = useS3Image(user?.profilePicture, {
  //   refreshInterval: 3000000,
  //   fallbackUrl: '/default-avatar.png'
  // });

  const getUserData = async () => {
    setIsLoading(true);
    try {
      const userData = await fetchUserProfile();
      setUser(userData);
    } catch (error) {
      if (error instanceof Error && error.message === 'Unauthorized') {
        logout();
      } else {
        console.log('Error fetching profile:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    logout();
    navigate('/');
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isAuthenticated && !user) {
      getUserData();
    }
  }, [isAuthenticated, user]);

  return (
    <header>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-logo">
            <Link to="/">
              <img src="/assets/logo.png" alt="Travel Blog Explorer Logo" className="logo" />
            </Link>
          </div>
          <div className="navbar-links">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Home
            </NavLink>
            {isAuthenticated ? (
              <div className="profile-menu-container" ref={profileMenuRef}>
                <button 
                  className="profile-trigger"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="profile-loading-spinner" />
                  ) : (
                    <img 
                      src={user?.profilePicture || '/default-avatar.png'} 
                      alt="Profile" 
                      className="profile-avatar"
                    />
                  )}
                </button>
                {user && (
                  <ProfileMenu 
                    user={user}
                    onLogout={handleLogout}
                    isOpen={isProfileMenuOpen}
                  />
                )}
              </div>
            ) : (
              <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
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