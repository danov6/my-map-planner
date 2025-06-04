import { Request, Response } from "express";
import User from "../models/UserModel";

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
      console.log("User ID not found in token");
      return res.status(401).json({ error: "User ID not found in token" });
    }

    const { firstName, lastName, email, profilePicture, bio } = req.body;

    // const user = await User.findById(userId);

    // if (!user) {
    //     console.log('User not found:', { userId });
    //     return res.status(404).json({ error: 'User not found' });
    // }

    // // Update only provided fields
    // if (firstName !== undefined) user.firstName = firstName;
    // if (lastName !== undefined) user.lastName = lastName;
    // if (email !== undefined) user.email = email;
    // if (profilePicture !== undefined) user.profilePicture = profilePicture;
    // if (bio !== undefined) user.bio = bio;

    // await user.save();

    console.log("Profile updated successfully:", { userId });
    res.json({
      //   email: user.email,
      firstName,
      lastName,
      //   profilePicture: user.profilePicture,
      //   bio: user.bio,
      //   favorites: user.favorites,
      //   blogs: user.blogs,
    });
  } catch (error) {
    console.log("Profile update error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};
