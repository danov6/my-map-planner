import { Request, Response } from "express";
import User from "../models/UserModel";
import { uploadToS3, getSignedImageUrl } from '../services/s3Service';

interface AuthRequest extends Request {
  user?: { userId: string };
}

export const getProfile = async (
  req: AuthRequest | any,
  res: Response | any
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "User ID not found in token" });
    }

    const user = await User.findById(userId).select(
      "-password -resetToken -resetTokenExpiry"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Profile fetched successfully:", { user });
    res.json({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      bio: user.bio,
      favorites: user.favorites,
      blogs: user.blogs,
    });
  } catch (error) {
    console.log("Profile fetch error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const updateProfile = async (
  req: AuthRequest | any,
  res: Response | any
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      console.log("[ userController ] User ID not found in token");
      return res.status(401).json({ error: "User ID not found in token" });
    }

    const { firstName, lastName, email, profilePicture, bio } = req.body;

    const user = await User.findById(userId);

    if (!user) {
        console.log('[ userController ] User not found:', { userId });
        return res.status(404).json({ error: 'User not found' });
    }

    // Update only provided fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (email !== undefined) user.email = email;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    console.log("[ userController ] Profile updated successfully:", { userId });
    res.json({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        bio: user.bio,
        favorites: user.favorites,
        blogs: user.blogs,
    });
  } catch (error) {
    console.log("[ userController ] Profile update error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

export const uploadProfilePicture = async (req: Request | any, res: Response | any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const s3Key = await uploadToS3(req.file);
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: s3Key },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const imageUrl = await getSignedImageUrl(s3Key);
    res.json({ 
      message: 'Profile picture updated successfully',
      imageUrl,
      user: {
        ...user.toObject(),
        profilePicture: imageUrl
      }
    });
  } catch (error) {
    console.error('[ userController ] Profile picture upload error:', error);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
};
