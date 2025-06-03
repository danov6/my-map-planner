import { UserProfile } from "../../shared/types";

const API_URL = process.env.API_URL || "http://localhost:53195";

export async function fetchUserProfile(): Promise<UserProfile> {
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
}

interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  email?: string;
}

export async function updateUserProfile(
  profileData: UpdateProfileData
): Promise<UserProfile> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_URL}/api/profile/update`, {
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
}
