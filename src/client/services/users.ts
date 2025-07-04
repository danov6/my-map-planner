import { UserProfile } from "../../shared/types";

const API_URL = process.env.API_URL || "http://localhost:53195";

export const fetchUserProfile = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_URL}/api/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error("Failed to fetch profile");
  }

  return response.json();
};

export const updateUserProfile = async (profileData: UserProfile) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_URL}/api/users/profile/update`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    const error = await response.json();
    throw new Error(error.message || "Failed to update profile");
  }

  return response.json();
};

export const uploadProfilePicture = async (file: File): Promise<any> => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_URL}/api/users/profile-picture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // Make sure this matches verifyToken expectations
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload profile picture");
  }

  return response.json();
};

export const createProfile = async (credentials: any): Promise<any> => {
  const response = await fetch(`${API_URL}/api/users/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Registration failed');
  }

  return data;
};
