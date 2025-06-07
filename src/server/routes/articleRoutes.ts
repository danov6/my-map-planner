import express from 'express';
import { getArticle, getArticles } from '../controllers/articleController';

const router = express.Router();

router.get('/', getArticles);
router.get('/article', getArticle);

export default router;