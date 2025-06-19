import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'timeago.js';
import { FaRegBookmark, FaRegThumbsUp, FaRegEye } from 'react-icons/fa';
import { Article } from '../../shared/types';
import { useTopicNavigation } from '../hooks/useTopicNavigation';
import { fetchArticles } from '../services/articles';
import Spinner from './Spinner';
// import './styles.css';

interface ArticlesSectionProps {
  articles: Article[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange?: (page: number) => Promise<void>;
}

const ArticlesSection: React.FC<ArticlesSectionProps> = ({ 
  articles, 
  pagination,
  onPageChange 
}) => {
  const navigate = useNavigate();
  const handleTopicClick = useTopicNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const handleArticleClick = (articleId: string) => {
    navigate(`/articles/${articleId}`);
  };

  const handlePageClick = async (page: number) => {
    setIsLoading(true);
    if (onPageChange) {
      await onPageChange(page || 1);
    }
    setIsLoading(false);
  };

  return (
    <div className="articles-section">
      {(articles || []).map(article => (
        <article 
          key={article._id} 
          className="featured-article"
          onClick={() => handleArticleClick(article._id)}
        >
          <div className="article-image">
            <img src={article.headerImageUrl} alt={article.title} />
          </div>
          <div className="article-content">
            <div className="article-header">
              <h2 className="article-title">{article.title}</h2>
              <p className="article-subtitle">{article.subtitle}</p>
            </div>
            <div className="article-footer">
              <div className="article-topics">
                {(article?.topics || []).map((topic: string, index: number) => (
                  <button
                    key={index}
                    className="topic-tag topic-tag-small"
                    onClick={(e) => handleTopicClick(e, topic)}
                  >
                    {topic}
                  </button>
                ))}
              </div>
              <div className="article-meta">
                <span className="article-date">
                  {format(new Date(article.date))}
                </span>
                <span className="article-stats">
                  <FaRegThumbsUp className="icon" />
                  <span className="views">{article.stats.likes}</span>
                  <FaRegEye className="icon" />
                  <span className="comments">{article.stats.views}</span>
                </span>
              </div>
            </div>
          </div>
        </article>
      ))}
      
      {pagination && (
        <div className="pagination">
          {isLoading ? (
            <div className="pagination-loading">
              <Spinner />
            </div>
          ) : (
            Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-button ${page === pagination.currentPage ? 'active' : ''}`}
                onClick={() => handlePageClick(page)}
                disabled={page === pagination.currentPage || isLoading}
              >
                {page}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ArticlesSection;