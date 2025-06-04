import express from 'express';
import { createGuide } from '../controllers/guideController';

const router = express.Router();

router.post('/', createGuide);

export default router;