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

export const getArticles = async (req: Request | any, res: Response | any) => {
  try {
    const {
      page = 1,
      limit = 10,
      country,
      topics = [],
      sortBy = 'date',
      timeRange,
      viewsOnly = false
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    
    // Build filter
    const filter: any = {};
    if (country) {
      filter.country = country;
    }
    if (topics.length > 0) {
      filter.topics = { $in: topics };
    }
    if (timeRange === '24h') {
      filter.date = {
        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
      };
    }

    // Build sort configuration
    const sortConfig: any = {};
    if (sortBy === 'views') {
      sortConfig['stats.views'] = -1;
    } else {
      sortConfig.date = -1;
    }

    // If viewsOnly is true, limit to 3 most viewed
    const queryLimit = viewsOnly ? 3 : Number(limit);

    const articles = await Article.find(filter)
      .populate('author', 'firstName lastName profilePicture')
      .select(viewsOnly ? 'title author date stats headerImageUrl countryCode' : '-content')
      .sort(sortConfig)
      .skip(viewsOnly ? 0 : skip)
      .limit(queryLimit);

    const totalArticles = await Article.countDocuments(filter);
    const totalPages = Math.ceil(totalArticles / Number(limit));

    res.json({
      articles,
      pagination: viewsOnly ? undefined : {
        currentPage: Number(page),
        totalPages,
        totalArticles,
        hasNextPage: Number(page) < totalPages,
        hasPreviousPage: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
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

    const newArticle = new Article({
      title,
      subtitle,
      content,
      headerImageUrl,
      author: req.user.userId,
      countryCode: country || 'Unknown',
      topics,
      date: new Date(),
      stats: {
        likes: 0,
        views: 0,
        saves: 0
      }
    });

    const session = await Article.startSession();
    session.startTransaction();

    try {
      await newArticle.save({ session });
      
      await User.findByIdAndUpdate(
        req.user.userId,
        { 
          $push: { 
            createdArticles: newArticle._id 
          }
        },
        { session }
      );

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

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
      // Remove like and remove article topics from user's favoriteTopics
      await Promise.all([
        Article.findByIdAndUpdate(articleId, { $inc: { 'stats.likes': -1 } }),
        User.findByIdAndUpdate(userId, {
          $pull: { likedArticles: articleId },
          // Remove only topics that came from this article
          $pullAll: { favoriteTopics: article.topics }
        })
      ]);
    } else {
      // Add like and add article topics to user's favoriteTopics
      await Promise.all([
        Article.findByIdAndUpdate(articleId, { $inc: { 'stats.likes': 1 } }),
        User.findByIdAndUpdate(userId, {
          $push: { likedArticles: articleId },
          // Add topics only if they don't already exist
          $addToSet: { favoriteTopics: { $each: article.topics } }
        })
      ]);
    }

    // Fetch updated user to return current favorite topics
    const updatedUser = await User.findById(userId).select('favoriteTopics');

    console.log('[ articleController ] Article like toggled:', { 
      articleId,
      userId,
      action: hasLiked ? 'unliked' : 'liked',
      topicsAffected: article.topics
    });

    res.json({ 
      liked: !hasLiked,
      favoriteTopics: updatedUser?.favoriteTopics || []
    });
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
    //const countries = ['USA', 'HRV', 'CHE'];
    
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

export const getArticlesByCountry = async (req: Request | any, res: Response | any) => {
  try {
    const { countryCode } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!countryCode || countryCode.length !== 3) {
      console.error('[ articleController ] Invalid country code:', { countryCode });
      return res.status(400).json({ error: 'Invalid country code' });
    }

    const filter = { countryCode: countryCode.toUpperCase() };

    const [articles, totalArticles] = await Promise.all([
      Article.find(filter)
        .populate('author', 'firstName lastName profilePicture')
        .select('-__v -content')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),
      Article.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalArticles / limit);

    console.log('[ articleController ] Articles fetched by country:', { 
      countryCode,
      page,
      totalArticles
    });

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
    console.error('[ articleController ] Error fetching articles by country:', error);
    res.status(500).json({ 
      error: 'Failed to fetch articles',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const toggleArticleBookmark = async (req: Request | any, res: Response | any) => {
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
    const hasBookmarked = user?.savedArticles?.includes(articleId);

    if (hasBookmarked) {
      // Remove bookmark
      await Promise.all([
        Article.findByIdAndUpdate(articleId, { $inc: { 'stats.saves': -1 } }),
        User.findByIdAndUpdate(userId, {
          $pull: { savedArticles: articleId }
        })
      ]);
    } else {
      // Add bookmark
      await Promise.all([
        Article.findByIdAndUpdate(articleId, { $inc: { 'stats.saves': 1 } }),
        User.findByIdAndUpdate(userId, {
          $addToSet: { savedArticles: articleId }
        })
      ]);
    }

    console.log('[ articleController ] Article bookmark toggled:', { 
      articleId,
      userId,
      action: hasBookmarked ? 'unbookmarked' : 'bookmarked'
    });

    res.json({ 
      bookmarked: !hasBookmarked,
      saves: hasBookmarked ? article.stats.saves - 1 : article.stats.saves + 1
    });
  } catch (error) {
    console.error('[ articleController ] Error toggling article bookmark:', error);
    res.status(500).json({ error: 'Failed to toggle bookmark' });
  }
};