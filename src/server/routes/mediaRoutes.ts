import express from 'express';
import { uploadImage } from '../controllers/mediaController';
import { verifyToken } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = express.Router();

router.post('/images/upload', verifyToken, upload.single('image'), uploadImage);

export default router;