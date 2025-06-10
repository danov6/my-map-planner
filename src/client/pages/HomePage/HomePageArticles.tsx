import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'timeago.js';
import { AppContext } from '../../context/AppContext';
import { FaRegBookmark, FaRegThumbsUp, FaRegEye } from 'react-icons/fa';

const HomePageArticles: React.FC<any> = () => {
  const { articles } = useContext(AppContext);
  const navigate = useNavigate();

  const handleArticleClick = (articleId: string) => {
    navigate(`/articles/${articleId}`);
  };

  console.log('Articles:', articles);
  return (
    <div className="articles-section">
      {(articles || []).map(article => (
        <article 
          key={article._id} 
          className="featured-article"
          onClick={() => handleArticleClick(article._id)}
          style={{ cursor: 'pointer' }}
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
                {article.topics.slice(0, 5).map((topic, index) => (
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

export default HomePageArticles;