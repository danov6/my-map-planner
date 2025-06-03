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
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
    }
  }, [user]);

  const isValidData = () => {
    return (
      formData.firstName?.trim() !== "" && formData.lastName?.trim() !== ""
    );
  };

  const hasChanges = () => {
    if (!isValidData()) return false;

    return Object.keys(formData).some((key) => {
      const formValue = formData[key as keyof typeof formData]?.trim() || "";
      const userValue = (user[key as keyof UserProfile] || "").trim();
      return formValue !== userValue;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onUpdate(formData);
      onClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
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
          {/* <div className="form-group">
            <label>Profile Picture URL</label>
            <input
              type="text"
              value={formData.profilePicture}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  profilePicture: e.target.value,
                }))
              }
              placeholder="Profile picture URL"
            />
          </div> */}
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
              title={!isValidData() ? "Please fill in required fields" : ""}
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
