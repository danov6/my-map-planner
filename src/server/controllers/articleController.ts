import { Request, Response } from 'express';
import Article from '../models/ArticleModel';
import User from '../models/UserModel';

export const getArticle = async (req: Request | any, res: Response | any) => {
  try {
    const { id } = req.params;
    console.log('[ articleController ] Article ID:', id);

    if (!id) {
      console.error('[ articleController ] No article ID provided');
      return res.status(400).json({ error: 'Article ID is required' });
    }

    // Find and update the article atomically
    const article = await Article.findByIdAndUpdate(
      id,
      { $inc: { 'stats.views': 1 } }, // Increment views by 1
      { 
        new: true, // Return updated document
        runValidators: true // Run model validations
      }
    )
    .populate('author', 'firstName lastName profilePicture')
    .select('-__v');

    if (!article) {
      console.error('[ articleController ] Article not found:', { id });
      return res.status(404).json({ error: 'Article not found' });
    }

    console.log('[ articleController ] Article fetched successfully:', { 
      id,
      views: article.stats.views,
    });

    res.json(article);
  } catch (error) {
    console.error('[ articleController ] Error fetching article:', error);
    res.status(500).json({ 
      error: 'Failed to fetch article',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getArticles = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    
    const country = req.query.country as string;
    const topics = Array.isArray(req.query.topic) 
      ? req.query.topic
      : req.query.topic 
        ? [req.query.topic]
        : [];

    const filter: any = {};
    if (country) {
      filter.country = country;
    }
    if (topics.length > 0) {
      filter.topics = { $in: topics };
    }

    const articles = await Article.find(filter)
      .populate('author', 'firstName lastName profilePicture')
      .select('-__v')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const totalArticles = await Article.countDocuments(filter);
    const totalPages = Math.ceil(totalArticles / limit);

    console.log('[ articleController ] Articles fetched successfully:', { 
      page, 
      totalPages,
      filters: {
        country,
        topics
      }
    });
    
    res.json({
      articles, //MOCK_ARTICLES, // Replace with articles when using real data
      pagination: {
        currentPage: page,
        totalPages,
        totalArticles,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      },
      filters: {
        country,
        topics
      }
    });
  } catch (error) {
    console.error('[ articleController ] Error fetching articles:', error);
    res.status(500).json({ 
      error: 'Failed to fetch articles',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createArticle = async (req: Request | any, res: Response | any) => {
  try {
    if (!req.user) {
      console.error('[ articleController ] User not authenticated');
      return res.status(401).json({ error: 'Authentication required' });
    }

    const {
      title,
      subtitle,
      content,
      headerImageUrl,
      country,
      topics
    } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Title and content are required' 
      });
    }

    const randomTopics = [
      'Hotels and Accommodation',
      'Travel Tips',
    ];

    const newArticle = new Article({
      title,
      subtitle,
      content,
      headerImageUrl,
      author: req.user.userId,
      country: 'USA',
      topics: randomTopics || [],
      date: new Date(),
      stats: {
        likes: 0,
        views: 0,
        saves: 0
      }
    });

    await newArticle.save();

    const populatedArticle = await Article.findById(newArticle._id)
      .populate('author', 'firstName lastName profilePicture')
      .select('-__v');

    console.log('[ articleController ] Article created successfully:', { 
      articleId: newArticle._id,
      author: req.user.userId 
    });

    res.status(201).json(populatedArticle);
  } catch (error) {
    console.error('[ articleController ] Error creating article:', error);
    res.status(500).json({ 
      error: 'Failed to create article',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const toggleArticleLike = async (req: Request | any, res: Response | any) => {
  try {
    const { articleId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      console.error('[ articleController ] User not authenticated');
      return res.status(401).json({ error: 'Authentication required' });
    }

    const article = await Article.findById(articleId);
    if (!article) {
      console.error('[ articleController ] Article not found:', { articleId });
      return res.status(404).json({ error: 'Article not found' });
    }

    const user = await User.findById(userId);
    const hasLiked = user?.likedArticles?.includes(articleId);

    if (hasLiked) {
      await Promise.all([
        Article.findByIdAndUpdate(articleId, { $inc: { 'stats.likes': -1 } }),
        User.findByIdAndUpdate(userId, { $pull: { likedArticles: articleId } })
      ]);
    } else {
      await Promise.all([
        Article.findByIdAndUpdate(articleId, { $inc: { 'stats.likes': 1 } }),
        User.findByIdAndUpdate(userId, { $push: { likedArticles: articleId } })
      ]);
    }

    res.json({ liked: !hasLiked });
  } catch (error) {
    console.error('[ articleController ] Error toggling article like:', error);
    res.status(500).json({ error: 'Failed to toggle article like' });
  }
};

export const updateArticle = async (req: Request | any, res: Response | any) => {
  try {
    const { id } = req.params;
    const { title, subtitle, content, headerImageUrl, topics } = req.body;
    const userId = req.user?.userId;

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    if (article.author.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to edit this article' });
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      {
        title,
        subtitle,
        content,
        headerImageUrl,
        topics,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('author', 'firstName lastName profilePicture');

    res.json(updatedArticle);
  } catch (error) {
    console.error('[ articleController ] Error updating article:', error);
    res.status(500).json({ 
      error: 'Failed to update article',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getUniqueCountries = async (req: Request, res: Response) => {
  try {
    const countries = await Article.distinct('countryCode');
    
    console.log('[ articleController ] Unique countries fetched:', { 
      count: countries.length,
      countries 
    });

    res.json({ countries });
  } catch (error) {
    console.error('[ articleController ] Error fetching unique countries:', error);
    res.status(500).json({ 
      error: 'Failed to fetch countries',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};