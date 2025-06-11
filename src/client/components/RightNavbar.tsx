import React, { useEffect, useState } from 'react';
import { TRAVEL_TOPICS } from 'client/constants';
import { fetchMostViewedArticles } from '../services/articles';
import { UserProfile, Article } from '../../shared/types';
import { COUNTRY_LIST } from 'client/constants';

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
  const [mostViewed, setMostViewed] = useState<Article[]>([]);
  const topics = TRAVEL_TOPICS?.splice(0, 10) || [];

  const getCountryNameByCode = (countryCode: string | undefined): string => {
    const country = COUNTRY_LIST.find(
      country => country.countryCode === countryCode?.toUpperCase()
    );
    return country?.name || '';
  };

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
          {mostViewed.map((pick, key) => (
            <div key={pick._id} className="staff-pick-item">
              <h3>{(key + 1) + ". " + pick.title}</h3>
              <div className="country-name">{getCountryNameByCode(pick.countryCode)}</div>
              <div className="author-info">
                <img 
                  src={pick.author.profilePicture || '/default-avatar.png'} 
                  alt={pick.author.firstName}
                  className="author-image"
                />
                <span>{pick.author.firstName}</span>
              </div>
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