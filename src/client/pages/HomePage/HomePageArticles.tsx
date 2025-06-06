import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { FaRegBookmark, FaRegThumbsUp, FaRegEye } from 'react-icons/fa';

const HomePageArticles: React.FC<any> = () => {
  const { articles } = useContext(AppContext);
  const navigate = useNavigate();

  const handleArticleClick = (articleId: string) => {
    navigate(`/article?id=${articleId}`);
  };

  return (
    <div className="articles-section">
      {(articles || []).map(article => (
        <article 
          key={article.id} 
          className="featured-article"
          onClick={() => handleArticleClick(article.id)}
          style={{ cursor: 'pointer' }}
        >
          <div className="article-content">
            <h2 className="article-title">{article.title}</h2>
            <p className="article-subtitle">{article.subtitle}</p>
            <div className="article-meta">
              <span className="article-date">{article.date}</span>
              <span className="article-stats">
                <FaRegThumbsUp className="icon" />
                <span className="views">{article.stats.views}</span>
                <FaRegEye className="icon" />
                <span className="comments">{article.stats.views}</span>
              </span>
              <div className="article-topics">
                {article.topics.slice(0, 5).map((topic, index) => (
                  <button key={index} className="topic-tag topic-tag-small">
                    {topic}
                  </button>
                ))}
              </div>
              <div className="article-actions">
                <button className="action-btn">
                  <FaRegBookmark className="icon" />
                </button>
              </div>
            </div>
          </div>
          <div className="article-image">
            <img src={article.imageUrl} alt={article.title} />
          </div>
        </article>
      ))}
    </div>
  );
};

export default HomePageArticles;