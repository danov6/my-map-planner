import express from 'express';
import { login, signup, forgotPassword, getProfile } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', signup);
router.post('/forgot-password', forgotPassword);
router.get('/profile', verifyToken, getProfile);

export default router;