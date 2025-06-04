import React, { useState, useEffect } from "react";
import { UserProfile } from "../../shared/types";
import "../styles/modal.css";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdate: (data: Partial<UserProfile>) => Promise<void>;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdate,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    bio: user?.bio || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const hasChanges = () => {
    const firstNameChanged =
      formData.firstName.trim() !== (user.firstName || "").trim();
    const lastNameChanged =
      formData.lastName.trim() !== (user.lastName || "").trim();
    const bioChanged = formData.bio.trim() !== (user.bio || "").trim();

    return firstNameChanged || lastNameChanged || bioChanged;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onUpdate(formData);
      onClose();
    } catch (error) {
      console.log("Failed to update profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, firstName: e.target.value }))
              }
              placeholder="First name"
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, lastName: e.target.value }))
              }
              placeholder="Last name"
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bio: e.target.value }))
              }
              placeholder="Tell us a little about yourself..."
              maxLength={500}
            />
          </div>
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="modal-button secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-button primary"
              disabled={!hasChanges() || isLoading}
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfileModal;
