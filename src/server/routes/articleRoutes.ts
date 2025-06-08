import express from 'express';
import { getArticle, getArticles, createArticle } from '../controllers/articleController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getArticles);
// Change the route to use URL parameters
router.get('/article/:id', getArticle);
router.post('/create', verifyToken, createArticle);

export default router;