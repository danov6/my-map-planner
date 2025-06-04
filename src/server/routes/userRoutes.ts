import express from 'express';
import { getProfile, updateProfile, uploadProfilePicture } from '../controllers/userController';
import { verifyToken } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = express.Router();

router.get('/profile', verifyToken, getProfile);
router.post('/profile/update', verifyToken, updateProfile);
router.post('/profile-picture', verifyToken, upload.single('image'), uploadProfilePicture);

export default router;