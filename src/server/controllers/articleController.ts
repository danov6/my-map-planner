import { Request, Response } from 'express';
import Article from '../models/ArticleModel';

export const getArticle = async (req: Request | any, res: Response | any) => {
  try {
    const { articleId } = req.params;

    const article = await Article.findById(articleId)
      .populate('author', 'firstName lastName profilePicture')
      .select('-__v');

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    console.log('Article fetched successfully:', { articleId });
    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
};

export const getArticles = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const articles = await Article.find()
      .populate('author', 'firstName lastName profilePicture')
      .select('-__v')
      .sort({ date: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    const totalArticles = await Article.countDocuments();
    const totalPages = Math.ceil(totalArticles / limit);

    console.log('Articles fetched successfully:', { page, totalPages });
    
    res.json({
      articles,
      pagination: {
        currentPage: page,
        totalPages,
        totalArticles,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ 
      error: 'Failed to fetch articles',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};