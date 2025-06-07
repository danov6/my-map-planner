import express from 'express';
import { getArticle, getArticles, createArticle } from '../controllers/articleController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getArticles);
router.get('/:articleId', getArticle);
router.post('/', verifyToken, createArticle);

export default router;