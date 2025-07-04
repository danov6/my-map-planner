import { Request, Response } from "express";
import User from "../models/UserModel";
import { uploadToS3 } from '../services/s3Service';
import sharp from 'sharp';
import jwt from 'jsonwebtoken';

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

    const user = await User.findById(userId)
      .select("-password -resetToken -resetTokenExpiry")
      .populate({
        path: 'savedArticles',
        select: 'title subtitle headerImageUrl date stats topics countryCode',
        populate: {
          path: 'author',
          select: 'firstName lastName profilePicture'
        }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Profile fetched successfully:", { user });
    res.json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      bio: user.bio,
      likedArticles: user.likedArticles,
      savedArticles: user.savedArticles,
      createdArticles: user.createdArticles,
      favoriteTopics: user.favoriteTopics,
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
        savedArticles: user.savedArticles,
        favoriteTopics: user.favoriteTopics,
        createdArticles: user.createdArticles,
    });
  } catch (error) {
    console.log("[ userController ] Profile update error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

export const createProfile = async (req: Request | any, res: Response | any) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('[ userController ] Signup validation error:', { email });
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('[ userController ] Signup error: Email already registered:', { email });
      return res.status(400).json({ error: 'Email already registered' });
    }

    const newUser = new User({
      email: email.toLowerCase(),
      username: 'user' + (new Date()).getTime(),
      password,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    console.log('[ userController ] User registered successfully:', { email });
    res.status(201).json({
      token,
      message: 'Registration successful',
      user: {
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        profilePicture: newUser.profilePicture,
      },
    });
  } catch (error) {
    console.log('[ userController ] Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
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
      profilePicture: imageUrlWithCache,
      user: user.toObject()
    });
  } catch (error) {
    console.error('[ userController ] Profile picture upload error:', error);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
};
