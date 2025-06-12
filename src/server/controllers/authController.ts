import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel';
import { sendResetEmail } from '../services/emailService';

export const login = async (req: Request | any, res: Response | any) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
      .populate({
        path: 'savedArticles',
        select: 'title subtitle headerImageUrl date stats topics countryCode author',
        populate: {
          path: 'author',
          select: 'firstName lastName profilePicture'
        }
      });

    if (!user || !(await user.comparePassword(password))) {
      console.log('[ authController ] Invalid login attempt:', { email });
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log('[ authController ] User found:', { email });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    res.json({ 
      token, 
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        bio: user.bio,
        savedArticles: user.savedArticles,
        createdArticles: user.createdArticles,
        favoriteTopics: user.favoriteTopics,
      } 
    });
  } catch (error) {
    console.log('[ authController ] Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const signup = async (req: Request | any, res: Response | any) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('[ authController ] Signup validation error:', { email });
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('[ authController ] Signup error: Email already registered:', { email });
      return res.status(400).json({ error: 'Email already registered' });
    }

    const newUser = new User({
      email: email.toLowerCase(),
      password,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    console.log('[ authController ] User registered successfully:', { email });
    res.status(201).json({
      token,
      message: 'Registration successful',
      user: {
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        profilePicture: newUser.profilePicture,
      },
    });
  } catch (error) {
    console.log('[ authController ] Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const forgotPassword = async (req: Request | any, res: Response | any) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log('[ authController ] Forgot password: No user found:', { email });
      return res.json({ message: 'If an account exists, you will receive an email with reset instructions.' });
    }

    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    try {
      await sendResetEmail(email, resetToken);
      console.log('[ authController ] Password reset email sent:', { email });
      res.json({ message: 'If an account exists, you will receive an email with reset instructions.' });
    } catch (emailError) {
      console.log('[ authController ] Email service error:', emailError);
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();
      
      console.log('[ authController ] Failed to send reset email:', { email });
      res.status(500).json({ error: 'Failed to send reset email' });
    }
  } catch (error) {
    console.log('[ authController ] Password reset error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

export const verifyResetToken = async (req: Request | any, res: Response | any) => {
  try {
    const { token } = req.body;

    if (!token) {
      console.log('[ authController ] Token is required')
      return res.status(400).json({ error: 'Token is required' });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      console.log('[ authController ] Invalid or expired reset token');
      return res.status(400).json({ error: 'Reset token has expired. Please try again' });
    }

    console.log('[ authController ] Reset token verified for user:', user.email);
    res.json({ email: user.email });

  } catch (error) {
    console.error('[ authController ] Token verification error:', error);
    res.status(500).json({ error: 'Failed to verify reset token' });
  }
};

export const resetPassword = async (req: Request | any, res: Response | any) => {
  try {
    const { token, email, password } = req.body;

    // Validate required fields
    if (!token || !email || !password) {
      console.log('[ authController ] Reset password: Missing required fields');
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Find user with matching token and email
    const user = await User.findOne({
      email: email.toLowerCase(),
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      console.log('[ authController ] Reset password: Invalid token or email mismatch');
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Update password and clear reset token
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    console.log('[ authController ] Password reset successful:', { email });
    res.json({ message: 'Password has been reset successfully' });

  } catch (error) {
    console.error('[ authController ] Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};