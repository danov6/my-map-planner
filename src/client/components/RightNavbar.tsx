import React, { useEffect, useState } from 'react';
import { TRAVEL_TOPICS } from 'client/constants';
import { fetchMostViewedArticles } from '../services/articles';

interface StaffPick {
  id: string;
  author: string;
  title: string;
  date: string;
  authorImage?: string;
}

interface RightNavbarProps {
  variant: 'home' | 'profile';
  country?: string;
  favoriteTopics?: string[];
}

const RightNavbar: React.FC<RightNavbarProps> = ({ 
  variant, 
  country,
  favoriteTopics
}) => {
  const [mostViewed, setMostViewed] = useState<StaffPick[]>([]);
  const topics = TRAVEL_TOPICS?.splice(0, 10) || [];

  useEffect(() => {
    const loadMostViewed = async () => {
      const data = await fetchMostViewedArticles(country);
      setMostViewed(data.articles);
    };
    
    if (variant === 'home') {
      loadMostViewed();
    }
  }, [variant, country]);

  return (
    <aside className="right-navbar">
      <div className="right-navbar-content">
        <section className="staff-picks">
          <h2>Most Viewed Today</h2>
          {mostViewed.map((pick) => (
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
        </section>
        <section className="favorite-topics">
          <h2>Favorite Topics</h2>
          <div className="topics-list">
            {(favoriteTopics || topics).map((topic, index) => (
              <button key={index} className="topic-tag">
                {topic}
              </button>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
};

export default RightNavbar;