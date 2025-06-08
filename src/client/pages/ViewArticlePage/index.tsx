import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { format } from 'timeago.js';
import { AppContext } from '../../context/AppContext';
import { Article } from '../../../shared/types';
import Spinner from '../../components/Spinner';
import { FaRegBookmark, FaRegEye, FaRegThumbsUp, FaThumbsUp } from 'react-icons/fa';
import { fetchArticle, toggleArticleLike } from '../../services/articles';
import DOMPurify from 'dompurify';
import './styles.css';

const ViewArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const { liked } = await toggleArticleLike(article!._id);
      setArticle(prev => prev ? {
        ...prev,
        stats: {
          ...prev.stats,
          likes: prev.stats.likes + (liked ? 1 : -1)
        }
      } : null);
      setIsLiked(liked);
    } catch (err) {
      if (err instanceof Error && err.message === 'UNAUTHORIZED') {
        navigate('/login');
        return;
      }
      setError('Failed to update article like');
    }
  };

  useEffect(() => {
    if (user && article) {
      setIsLiked(user.likedArticles?.includes(article._id as any) || false);
    }
  }, [user, article]);

  useEffect(() => {
    const articleId = searchParams.get('id');
    if (!articleId) {
      navigate('/');
      return;
    }

    const loadArticle = async () => {
      try {
        const data = await fetchArticle(articleId);
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
  }, [searchParams, navigate]);

  if (isLoading) return <Spinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!article) return null;

  const sanitizedContent = DOMPurify.sanitize(article.content);

  console.log('is liked:', isLiked);
  return (
    <div className="article-page">
      <article className="article-container">
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
            <FaRegBookmark />
          </div>
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