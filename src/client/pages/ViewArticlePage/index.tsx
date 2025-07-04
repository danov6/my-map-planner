import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'timeago.js';
import { AppContext } from '../../context/AppContext';
import { Article, UserProfile } from '../../../shared/types';
import Spinner from '../../components/Spinner';
import { 
  FaRegBookmark,
  FaBookmark,
  FaRegEye, 
  FaRegThumbsUp, 
  FaThumbsUp, 
  FaShareAlt 
} from 'react-icons/fa';
import { fetchArticle, toggleArticleLike, toggleArticleBookmark } from '../../services/articles';
import DOMPurify from 'dompurify';
import { useTopicNavigation } from '../../hooks/useTopicNavigation';
import { DEFAULT_AVATAR_URL } from '../../constants';
import '../../styles/viewarticlepage.css';

const ViewArticlePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, setUser, setArticles } = useContext(AppContext);
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  // Add initial check for liked status
  useEffect(() => {
    if (user && article) {
      const hasLiked = !!user.likedArticles?.includes(article._id);
      setIsLiked(hasLiked);
      
      console.log('Like status check:', {
        articleId: article._id,
        likedArticles: user.likedArticles,
        isLiked: hasLiked
      });
    }
  }, [user?.likedArticles, article?._id]);

  const handleLike = async () => {
    if (!isAuthenticated || !article) {
      navigate('/login');
      return;
    }

    try {
      const { liked, favoriteTopics } = await toggleArticleLike(article._id);
      const newLikes = article.stats.likes + (liked ? 1 : -1);
      
      // Update local state
      setArticle(prev => prev ? {
        ...prev,
        stats: {
          ...prev.stats,
          likes: newLikes
        }
      } : null);

      // Update articles in context
      setArticles((prevArticles: Article[])  => 
        prevArticles.map((a: Article) => 
          a._id === article._id
        ? {
            ...a,
            stats: {
          ...a.stats,
          likes: newLikes
            }
          }
        : a
        )
      );

      setIsLiked(liked);

      setUser((prev: any) => {
        if (!prev) return prev;
        
        return {
          ...prev,
          favoriteTopics,
          likedArticles: liked 
            ? [...(prev.likedArticles || []), article._id]
            : prev.likedArticles?.filter((id: string) => id !== article._id)
        };
      });

      console.log('Like updated:', {
        liked,
        articleId: article._id,
        newLikes: article.stats.likes + (liked ? 1 : -1)
      });
    } catch (err) {
      if (err instanceof Error && err.message === 'UNAUTHORIZED') {
        navigate('/login');
        return;
      }
      setError('Failed to update article like');
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated || !article) {
      navigate('/login');
      return;
    }

    try {
      const { bookmarked, saves } = await toggleArticleBookmark(article._id);
      
      setArticle(prev => prev ? {
        ...prev,
        stats: {
          ...prev.stats,
          saves
        }
      } : null);

      setArticles((prevArticles) => 
        prevArticles.map(a => 
          a._id === article._id
            ? {
                ...a,
                stats: {
                  ...a.stats,
                  saves
                }
              }
            : a
        )
      );

      setIsBookmarked(bookmarked);
      
      setUser((prev: UserProfile) => {
        if (!prev) return prev;
        
        return {
          ...prev,
          savedArticles: bookmarked 
            ? [...(prev.savedArticles || []), article]
            : prev.savedArticles?.filter((saved: any) => 
                typeof saved === 'string' 
                  ? saved !== article._id 
                  : saved._id !== article._id
              )
        };
      });

      console.log('Bookmark updated:', {
        bookmarked,
        saves,
        articleId: article._id
      });
    } catch (err) {
      if (err instanceof Error && err.message === 'UNAUTHORIZED') {
        navigate('/login');
        return;
      }
      setError('Failed to update article bookmark');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          text: article?.subtitle,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  const handleTopicClick = useTopicNavigation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  useEffect(() => {
    if (user && article) {
      const isArticleInArray = (array: any[] = [], articleId: string): boolean => {
        return array.some(item => {
          const itemId = typeof item === 'string' ? item : item._id;
          return itemId === articleId;
        });
      };

      const newIsBookmarked = isArticleInArray(user.savedArticles, article._id);
      console.log('Updating bookmark state:', {
        articleId: article._id,
        savedArticles: user.savedArticles,
        newIsBookmarked
      });
      
      setIsBookmarked(newIsBookmarked);
    }
  }, [user?.savedArticles, article?._id]);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    const loadArticle = async () => {
      try {
        const data = await fetchArticle(id);
        setArticle(data);
      } catch (err) {
        if (err instanceof Error && err.message === 'NOT_FOUND') {
          navigate('/');
          return;
        }
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [id, navigate]);

  if (isLoading) return <Spinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!article) return null;

  const sanitizedContent = DOMPurify.sanitize(article.content);

  return (
    <div className="article-page">
      <article className="article-container">
        <div className="article-actions">
          <button className={`action-button bookmark ${isBookmarked ? 'bookmarked' : ''}`} onClick={handleBookmark}>
            {isBookmarked ? (
              <FaBookmark className="icon filled" />
            ) : (
              <FaRegBookmark className="icon" />
            )}
          </button>
          <button className="action-button share" onClick={handleShare}>
            <FaShareAlt className="icon" />
          </button>
        </div>

        <h1 className="article-title">{article.title}</h1>
        <p className="article-subtitle">{article.subtitle}</p>
        
        <div className="article-header-meta">
          <div className="author-info">
            <img 
              src={article?.author?.profilePicture || DEFAULT_AVATAR_URL} 
              alt={article?.author?.firstName || 'Author'}
              className="author-avatar"
            />
            <div className="author-details">
              <span className="author-name">{article.author.firstName}</span>
              <div className="read-time-info">
                <span>{format(new Date(article.date))}</span>
              </div>
            </div>
          </div>

          <div className="article-stats">
            <button 
              onClick={handleLike}
              className={`like-button ${isLiked ? 'liked' : ''}`}
            >
              {isLiked ? (
                <FaThumbsUp className="icon filled" />
              ) : (
                <FaRegThumbsUp className="icon" />
              )}
              <span>{article.stats.likes}</span>
            </button>
            <FaRegEye /> <span>{article.stats.views}</span>
          </div>

          {user?._id === article.author._id && (
            <button 
              className="edit-button"
              onClick={() => navigate(`/articles/${article._id}/edit`)}
            >
              Edit Article
            </button>
          )}
        </div>

        <div className="article-topics">
          {(article?.topics || []).map((topic, index) => (
            <button
              key={index}
              className="topic-tag"
              onClick={(e) => handleTopicClick(e, topic)}
            >
              {topic}
            </button>
          ))}
        </div>

        {article.headerImageUrl && (
          <div className="article-hero-image">
            <img src={article.headerImageUrl} alt={article.title} />
            {/* {article.imageCredit && (
              <span className="image-credit">{article.imageCredit}</span>
            )} */}
          </div>
        )}

        <div 
          className="article-content"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </article>
    </div>
  );
};

export default ViewArticlePage;