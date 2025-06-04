import express from 'express';
import { login, signup, forgotPassword } from '../controllers/authController';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/forgot-password', forgotPassword);

export default router;