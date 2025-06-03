import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', verifyToken, getProfile);
router.post('/profile/update', verifyToken, updateProfile);

export default router;