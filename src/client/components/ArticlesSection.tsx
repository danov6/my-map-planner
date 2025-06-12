import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'timeago.js';
import { FaRegBookmark, FaRegThumbsUp, FaRegEye } from 'react-icons/fa';
import { Article } from '../../shared/types';
// import './styles.css';

interface ArticlesSectionProps {
  articles: Article[];
}

const ArticlesSection: React.FC<ArticlesSectionProps> = ({ articles }) => {
  const navigate = useNavigate();

  const handleArticleClick = (articleId: string) => {
    navigate(`/articles/${articleId}`);
  };

  console

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
                {(article?.topics?.slice(0, 5) || []).map((topic: string, index: number) => (
                  <button key={index} className="topic-tag topic-tag-small">
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
    </div>
  );
};

export default ArticlesSection;