import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'timeago.js';
import { AppContext } from '../../context/AppContext';
import { Article } from '../../../shared/types';
import Spinner from '../../components/Spinner';
import { 
  FaRegBookmark, 
  FaRegEye, 
  FaRegThumbsUp, 
  FaThumbsUp, 
  FaShareAlt 
} from 'react-icons/fa';
import { fetchArticle, toggleArticleLike, toggleArticleBookmark } from '../../services/articles';
import DOMPurify from 'dompurify';
import './styles.css';

const ViewArticlePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, setUser } = useContext(AppContext);
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await toggleArticleLike(article!._id);
      const { liked, favoriteTopics } = response;
      setArticle(prev => prev ? {
        ...prev,
        stats: {
          ...prev.stats,
          likes: prev.stats.likes + (liked ? 1 : -1)
        }
      } : null);
      setIsLiked(liked);

      setUser({
        ...user!,
        favoriteTopics
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
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const { bookmarked, saves } = await toggleArticleBookmark(article!._id);
      setArticle(prev => prev ? {
        ...prev,
        stats: {
          ...prev.stats,
          saves: saves
        }
      } : null);
      setIsBookmarked(bookmarked);
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
        console.error('Error sharing:', err);
      }
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  useEffect(() => {
    if (user && article) {
      setIsLiked(user.likedArticles?.includes(article._id as any) || false);
      setIsBookmarked(user.savedArticles?.includes(article._id as any) || false);
    }
  }, [user, article]);

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

  // console.log('is liked:', isLiked);
  console.log('User ID:', user);
  console.log('Article Author ID:', article.author._id);
  return (
    <div className="article-page">
      <article className="article-container">
        <div className="article-actions">
          <button className="action-button" onClick={handleBookmark}>
            <FaRegBookmark className={`icon ${isBookmarked ? 'filled' : ''}`} />
          </button>
          <button className="action-button" onClick={handleShare}>
            <FaShareAlt className="icon" />
          </button>
        </div>

        <h1 className="article-title">{article.title}</h1>
        <p className="article-subtitle">{article.subtitle}</p>
        
        <div className="article-header-meta">
          <div className="author-info">
            <img 
              src={article?.author?.profilePicture || '/default-avatar.png'} 
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
                <FaRegThumbsUp className="icon filled" />
              ) : (
                <FaThumbsUp className="icon" />
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
          {article.topics.map((topic, index) => (
            <span key={index} className="topic-tag">
              {topic}
            </span>
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