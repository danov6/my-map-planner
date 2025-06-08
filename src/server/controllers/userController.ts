import { Request, Response } from "express";
import User from "../models/UserModel";
import { uploadToS3 } from '../services/s3Service';
import sharp from 'sharp';

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
      createdArticles: user.createdArticles,
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
        createdArticles: user.createdArticles,
    });
  } catch (error) {
    console.log("[ userController ] Profile update error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

export const uploadProfilePicture = async (req: Request | any, res: Response | any) => {
  try {
    if (!req.file) {
      console.log('[ userController ] No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      console.log('[ userController ] Invalid file type:', req.file.mimetype);
      return res.status(400).json({ 
        error: 'Invalid file type. Only JPEG, PNG and WebP images are allowed' 
      });
    }

    // Compress and resize image
    const compressedImageBuffer = await sharp(req.file.buffer)
      .resize(400, 400, { // Set max dimensions
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({
        quality: 80,
        mozjpeg: true
      })
      .toBuffer();

    const originalSize = req.file.size;
    const compressedSize = compressedImageBuffer.length;
    const filename = `profiles/${userId}.jpg`; // Always use .jpg since we convert to JPEG

    const s3Key = await uploadToS3({
      ...req.file,
      buffer: compressedImageBuffer,
      mimetype: 'image/jpeg'
    }, filename);
    
    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
    const cacheBuster = Date.now();
    const imageUrlWithCache = `${imageUrl}?v=${cacheBuster}`;

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: imageUrlWithCache },
      { new: true }
    );

    if (!user) {
      console.log('[ userController ] User not found:', { userId });
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('[ userController ] Profile picture updated successfully:', {
      userId,
      originalSize: `${(originalSize / 1024).toFixed(2)}KB`,
      compressedSize: `${(compressedSize / 1024).toFixed(2)}KB`,
      compressionRatio: `${((1 - compressedSize / originalSize) * 100).toFixed(1)}%`,
      fileType: 'image/jpeg',
      s3Key,
      publicUrl: imageUrlWithCache
    });

    res.json({ 
      message: 'Profile picture updated successfully',
      imageUrl: imageUrlWithCache,
      user: user.toObject()
    });
  } catch (error) {
    console.error('[ userController ] Profile picture upload error:', error);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
};
