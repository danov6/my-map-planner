import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel';
import { sendResetEmail } from '../services/sesService';

interface AuthRequest extends Request {
  user?: { userId: string };
}

export const login = async (req: Request | any, res: Response | any) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

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
    console.log('[ authController ] JWT Token: ', token);

    res.json({ token, user: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      bio: user.bio,
      favorites: user.favorites,
      createdArticles: user.createdArticles,
      favoriteTopics: user.favoriteTopics,
    } });
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
      console.log('Password reset email sent:', { email });
      res.json({ message: 'If an account exists, you will receive an email with reset instructions.' });
    } catch (emailError) {
      console.log('Email service error:', emailError);
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();
      
      console.log('Failed to send reset email:', { email });
      res.status(500).json({ error: 'Failed to send reset email' });
    }
  } catch (error) {
    console.log('Password reset error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

export const getProfile = async (req: AuthRequest | any, res: Response | any) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in token' });
    }

    const user = await User.findById(userId).select('-password -resetToken -resetTokenExpiry');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Profile fetched successfully:', { user });
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
    console.log('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};