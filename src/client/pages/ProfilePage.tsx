import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import '../styles/profile.css';

const ProfilePage: React.FC = () => {
  const { isAuthenticated, user } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        {user.profilePicture && (
          <img 
            src={user.profilePicture} 
            alt="Profile" 
            className="profile-picture"
          />
        )}
      </div>
      <div className="profile-content">
        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="profile-info">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          </div>
        </div>
        <div className="profile-section">
          <h2>My Activity</h2>
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-label">Blog Posts</span>
              <span className="stat-value">{user?.blogs?.length || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Favorites</span>
              <span className="stat-value">{user?.favorites?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;