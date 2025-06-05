import React, { useState, useEffect, useContext, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import EditProfileModal from '../components/EditProfileModal';
import { 
  updateUserProfile, 
  uploadProfilePicture, 
} from '../services/users';
import { FaPen } from 'react-icons/fa';
import '../styles/profile.css';

const ProfilePage: React.FC = () => {
  const { user, setUser } = useContext(AppContext);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const result = await uploadProfilePicture(file);
      setUser((prev) => ({
        ...prev!,
        profilePicture: result.imageUrl
      }));
    } catch (error) {
      console.log('Error uploading profile picture:', error);
      setError('Failed to upload profile picture');
    } finally {
      setIsLoading(false);
    }
  };

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
      const mergedData = { ...user, ...updatedData };
      const updatedUser = await updateUserProfile(mergedData);
      setUser(updatedUser);
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header-card">
        <div className="profile-main-info">
          <div 
            className="profile-picture-container"
            onClick={handleImageClick}
          >
            {user.profilePicture ? (
              <>
                <img 
                  src={user.profilePicture || '/placeholder.png'} 
                  alt="Profile" 
                  className="profile-picture"
                />
                <div className="profile-picture-overlay">
                  <span>Upload Image</span>
                </div>
              </>
            ) : (
              <>
                <div className="profile-picture-placeholder">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <div className="profile-picture-overlay">
                  <span>Upload Image</span>
                </div>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
          <div className="profile-details">
            <h1 className="profile-name">
              {user.firstName} {user.lastName}
            </h1>
            <p className="profile-email">{user.email}</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="edit-profile-btn"
        >
          <FaPen /> Edit
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>About Me</h2>
          <div className="profile-info">
            <p>{user.bio}</p>
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