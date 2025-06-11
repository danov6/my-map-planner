import express from 'express';
import { getArticle, getArticles, createArticle, toggleArticleLike, updateArticle, getUniqueCountries, getArticlesByCountry, toggleArticleBookmark } from '../controllers/articleController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getArticles);
router.get('/article/:id', getArticle);
router.post('/create', verifyToken, createArticle);
router.post('/article/like', verifyToken, toggleArticleLike);
router.post('/article/bookmark', verifyToken, toggleArticleBookmark);
router.post('/article/:id', verifyToken, updateArticle);
router.get('/countries', getUniqueCountries);
router.get('/countries/:countryCode', getArticlesByCountry);

export default router;