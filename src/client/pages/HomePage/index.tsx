import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import './styles.css';
import MapComponent from './MapComponent';
import Spinner from '../../components/Spinner';
import ArticlesSection from '../../components/ArticlesSection';
import RightNavbar from '../../components/RightNavbar';
import { fetchArticles } from '../../services/articles';

const HomePage: React.FC = () => {
  const { articles, setArticles, selectedCountry, user } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const countryCode = selectedCountry?.countryCode || null;
        const response = await fetchArticles(1, countryCode);
        setArticles(response.articles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load articles');
      } finally {
        setIsLoading(false);
      }
    };
    if (!articles || articles.length === 0) {
      loadArticles();
    } else {
      setIsLoading(false);
    }
  }, [setArticles, selectedCountry]);

  if (isLoading) return <Spinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="home-container">
      <div className="main-content">
        <div className="map-section">
          <h1>{selectedCountry?.name || 'Travel Guides 4 U'}</h1>
          <MapComponent />
        </div>
        <h2 className="articles-header">For you</h2>
        <ArticlesSection articles={articles ?? []} />
      </div>
      <RightNavbar 
        variant="home" 
        favoriteTopics={user?.favoriteTopics}
      />
    </div>
  );
};

export default HomePage;