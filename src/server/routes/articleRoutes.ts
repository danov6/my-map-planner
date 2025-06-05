import express from 'express';
import { getArticle, getArticles } from '../controllers/articleController';

const router = express.Router();

router.get('/', getArticles);
router.get('/:articleId', getArticle);

export default router;