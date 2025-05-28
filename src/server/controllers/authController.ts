import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel';
import { sendResetEmail } from '../services/emailService.js';

export const login = async (req: Request | any, res: Response | any) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

export const signup = async (req: Request | any, res: Response | any) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const newUser = new User({
      email: email.toLowerCase(),
      password, // Password will be hashed by the pre-save middleware
    });

    await newUser.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const forgotPassword = async (req: Request | any, res: Response | any) => {
  try {
    const { email } = req.body;

    // Find user without revealing if account exists
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Return success even if user doesn't exist (security best practice)
      return res.json({ message: 'If an account exists, you will receive an email with reset instructions.' });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    // Save reset token and expiry to user
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Send reset email
    try {
      await sendResetEmail(email, resetToken);
      res.json({ message: 'If an account exists, you will receive an email with reset instructions.' });
    } catch (emailError) {
      console.error('Email service error:', emailError);
      // Reset the token if email fails
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();
      
      res.status(500).json({ error: 'Failed to send reset email' });
    }
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};