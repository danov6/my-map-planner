import express from 'express';
import { getArticle, getArticles, createArticle, toggleArticleLike, updateArticle } from '../controllers/articleController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getArticles);
router.get('/article/:id', getArticle);
router.post('/create', verifyToken, createArticle);
router.post('/article/like', verifyToken, toggleArticleLike);
router.post('/article/:id', verifyToken, updateArticle);

export default router;