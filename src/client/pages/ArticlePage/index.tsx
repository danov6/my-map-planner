import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Article } from '../../../shared/types';
import Spinner from '../../components/Spinner';
import { FaRegBookmark, FaRegComment, FaRegHeart } from 'react-icons/fa';
import { fetchArticle } from '../../services/articles';
import './styles.css';

const ArticlePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="article-page">
      <article className="article-container">
        <header className="article-header">
          <h1>{article.title}</h1>
          {article.subtitle && <h2>{article.subtitle}</h2>}
          
          <div className="article-meta">
            <div className="author-info">
              <img 
                src={article.author.profilePicture || '/default-avatar.png'} 
                alt={article.author.firstName || 'Author'}
                className="author-avatar"
              />
              <div>
                <div className="author-name">{article.author.firstName}</div>
                <div className="article-date">{article.date}</div>
              </div>
            </div>
            
            <div className="article-actions">
              <button className="action-button">
                <FaRegHeart /> <span>{article.stats.likes}</span>
              </button>
              <button className="action-button">
                <FaRegBookmark />
              </button>
            </div>
          </div>
        </header>

        {article.imageUrl && (
          <div className="article-hero-image">
            <img src={article.imageUrl} alt={article.title} />
          </div>
        )}

        <div className="article-content">
          {article.content.split('\n').map((paragraph, index) => (
            <p key={index} className="article-paragraph">{paragraph}</p>
          ))}
        </div>

        <footer className="article-footer">
          <div className="article-topics">
            {article.topics?.map((topic, index) => (
              <span key={index} className="topic-tag">{topic}</span>
            ))}
          </div>
        </footer>
      </article>
    </div>
  );
};

export default ArticlePage;