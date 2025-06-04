import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/profile', verifyToken, getProfile);
router.post('/profile/update', verifyToken, updateProfile);

export default router;