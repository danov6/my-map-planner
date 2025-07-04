import React from 'react';
import { Link } from 'react-router-dom';
import { FaPencilAlt, FaPersonBooth, FaDoorOpen, FaUsers, FaRegEdit, FaRegUser } from 'react-icons/fa';
import { UserProfile } from '../../shared/types';
import { DEFAULT_AVATAR_URL } from '../constants';

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
          src={user?.profilePicture || DEFAULT_AVATAR_URL}
          alt="Profile" 
          className="profile-dropdown-avatar"
        />
        <span className="profile-dropdown-email">{user?.firstName || user?.email}</span>
      </div>
      <div className="profile-dropdown-divider" />
      <Link to="/profile" className="profile-dropdown-item">
        <FaRegUser /> Profile
      </Link>
      <Link to="/articles/create" className="profile-dropdown-item">
        <FaRegEdit /> Create Article
      </Link>
      <button onClick={onLogout} className="profile-dropdown-item">
        <FaDoorOpen /> Sign out
      </button>
    </div>
  );
};

export default ProfileMenu;