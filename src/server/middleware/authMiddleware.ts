import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/UserModel';
import rateLimit from 'express-rate-limit';

interface AuthRequest extends Request {
  user?: IUser;
}

export const verifyToken = async (req: AuthRequest | any, res: Response | any, next: NextFunction | any) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        console.log('Access denied. No token provided.');
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded as IUser;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const emailRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    error: 'Too many password reset attempts. Please try again in 15 minutes.',
    retryAfter: '15 minutes'
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many password reset attempts. Please try again in 15 minutes.',
      retryAfter: '15 minutes'
    });
  }
});