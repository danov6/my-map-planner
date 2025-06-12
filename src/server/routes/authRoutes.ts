import express from 'express';
import { login, signup, forgotPassword, verifyResetToken, resetPassword } from '../controllers/authController';
import { emailRateLimiter } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/forgot-password', emailRateLimiter, forgotPassword);
router.post('/verify-reset-token', emailRateLimiter, verifyResetToken);
router.post('/reset-password', emailRateLimiter, resetPassword);

export default router;