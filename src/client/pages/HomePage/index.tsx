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
  const [searchTerm, setSearchTerm] = useState('');

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
    loadArticles();
  }, [setArticles, selectedCountry]);

  const filteredArticles = articles?.filter(article => {
    const searchLower = searchTerm.toLowerCase();
    return (
      article.title.toLowerCase().includes(searchLower) ||
      article.topics.some(topic => 
        topic.toLowerCase().includes(searchLower)
      )
    );
  });

  if (isLoading) return <Spinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="home-container">
      <div className="main-content">
        <div className="map-section">
          <h1>Travel Guides 4 You</h1>
          <MapComponent />
        </div>
        <div className="content-section">
          <div className="section-header">
            <h2>For you</h2>
            <div className="search-container">
              <input
                type="search"
                placeholder="Search articles by title or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          <ArticlesSection articles={filteredArticles || []} />
        </div>
      </div>
      <RightNavbar 
        variant="home" 
        favoriteTopics={user?.favoriteTopics}
      />
    </div>
  );
};

export default HomePage;