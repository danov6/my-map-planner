import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import EditProfileModal from '../components/EditProfileModal';
import { updateUserProfile } from '../services/users';
import '../styles/profile.css';

const ProfilePage: React.FC = () => {
  const { user, setUser } = useContext(AppContext);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="profile-container">Loading...</div>;
  }

  if (error) {
    return <div className="profile-container error-message">{error}</div>;
  }

  if (!user) {
    return null;
  }

  const handleUpdateProfile = async (updatedData: Partial<typeof user>) => {
    try {
      const updatedUser = await updateUserProfile(updatedData);
      setUser(updatedUser);
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="edit-profile-btn"
        >
          Edit Profile
        </button>
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
            <p>
              <strong>Name:</strong> {user.firstName} {user.lastName}
            </p>
          </div>
        </div>
        <div className="profile-section">
          <h2>My Activity</h2>
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-label">Blog Posts</span>
              <span className="stat-value">{user.blogs?.length || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Favorites</span>
              <span className="stat-value">{user.favorites?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onUpdate={handleUpdateProfile}
      />
    </div>
  );
};

export default ProfilePage;