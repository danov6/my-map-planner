import React, { useState, useEffect } from 'react';
import './styles.css';
import MapComponent from './MapComponent';
import Spinner from '../../components/Spinner';
import { Article } from '../../../shared/types';
import { FaRegBookmark, FaRegComment, FaEllipsisH, FaRegHeart, FaRegThumbsUp, FaRegEye } from 'react-icons/fa';
import { TRAVEL_TOPICS } from 'client/constants';

const MOCK_STAFF_PICKS: any = [
  {
    id: '1',
    author: 'Scott Lamb',
    title: 'Want to just start writing? Join the "Write with Medium" June micro-challenge',
    date: '2d ago'
  },
  {
    id: '2',
    author: 'Dayna A. Ellis',
    title: 'Pride Didn\'t Ask Permission, Disruption Is Not Violence',
    date: '5d ago'
  }
];

// Updated MOCK_ARTICLES to include topics
const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'How to Learn a Language: The Complete System That Actually Works',
    subtitle: '20 Science-Based Principles and Strategies for Building Fluency — From a Linguist, Language Teacher, and Polyglot',
    author: {
      email: '',
      firstName: 'Viktoria'
    },
    date: 'May 21',
    imageUrl: '/brain-wordcloud.png',
    stats: {
      likes: 2800,
      views: 33000,
      saves: 2
    },
    topics: ['Language', 'Learning', 'Education', 'Psychology', 'Research'],
    content: 'This is a sample content for the article. It discusses various strategies and principles for learning languages effectively.'
  },
  {
    id: '2',
    title: 'How to Learn a Language: The Complete System That Actually Works',
    subtitle: '20 Science-Based Principles and Strategies for Building Fluency — From a Linguist, Language Teacher, and Polyglot',
    author: {
      email: '',
      firstName: 'Viktoria'
    },
    date: 'May 21',
    imageUrl: '/brain-wordcloud.png',
    stats: {
      likes: 2800,
      views: 33000,
      saves: 20
    },
    topics: ['Language', 'Learning', 'Education', 'Psychology', 'Research'],
    content: 'This is a sample content for the article. It discusses various strategies and principles for learning languages effectively.'
  }
];

const HomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    });

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home-container">
      <div className="main-content">
        <div className="map-section">
          <h1>Travel Guides 4 U</h1>
          {isLoading ? <Spinner /> : <MapComponent />}
        </div>
        
        <div className="articles-section">
          {MOCK_ARTICLES.map(article => (
            <article key={article.id} className="featured-article">
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
      </div>

      <aside className="right-navbar">
        <div className="right-navbar-content">
            <section className="staff-picks">
            <h2>Gio's Picks</h2>
            {MOCK_STAFF_PICKS.map((pick: any) => (
                <div key={pick.id} className="staff-pick-item">
                <div className="author-info">
                    <img 
                    src={pick.authorImage || '/default-avatar.png'} 
                    alt={pick.author}
                    className="author-image"
                    />
                    <span>by {pick.author}</span>
                </div>
                <h3>{pick.title}</h3>
                <span className="date">{pick.date}</span>
                </div>
            ))}
            <button className="see-full-list">See the full list</button>
            </section>

            <section className="recommended-topics">
            <h2>Recommended topics</h2>
            <div className="topics-list">
              {TRAVEL_TOPICS.map((topic, index) => (
                <button key={index} className="topic-tag">
                  {topic}
                </button>
              ))}
            </div>
            <button className="see-more-topics">See more topics</button>
            </section>
        </div>
      </aside>
    </div>
  );
};

export default HomePage;