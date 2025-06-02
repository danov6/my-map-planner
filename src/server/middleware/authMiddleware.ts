import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/UserModel';

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
    res.status(401).json({ error: 'Invalid token' });
  }
};