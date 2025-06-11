import express from 'express';
import { getCountry, createCountry, updateCountry } from '../controllers/countryController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/:countryCode', getCountry);

// Protected routes
router.post('/create', verifyToken, createCountry);
router.put('/:countryCode', verifyToken, updateCountry);

export default router;