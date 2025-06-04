import React from 'react';
import { Link } from 'react-router-dom';
import { UserProfile } from '../../shared/types';

interface ProfileMenuProps {
  user: UserProfile;
  onLogout: () => void;
  isOpen: boolean;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ user, onLogout, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="profile-dropdown">
      <div className="profile-dropdown-header">
        <img 
          src={user?.profilePicture || '/assets/default-avatar.png'}
          alt="Profile" 
          className="profile-dropdown-avatar"
        />
        <span className="profile-dropdown-email">{user?.email}</span>
      </div>
      <div className="profile-dropdown-divider" />
      <Link to="/profile" className="profile-dropdown-item">
        <i className="fas fa-user"></i>
        Profile
      </Link>
      {/* <Link to="/premium" className="profile-dropdown-item">
        <i className="fas fa-crown"></i>
        Upgrade to Premium
      </Link> */}
      <button onClick={onLogout} className="profile-dropdown-item">
        <i className="fas fa-sign-out-alt"></i>
        Sign out
      </button>
    </div>
  );
};

export default ProfileMenu;