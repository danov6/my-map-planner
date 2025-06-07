import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import './styles.css';
import MapComponent from './MapComponent';
import Spinner from '../../components/Spinner';
import HomePageArticles from './HomePageArticles';
import HomePageRightNavbar from './HomePageRightNavbar';
import { fetchArticles } from '../../services/articles';

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

const HomePage: React.FC = () => {
  const { articles, setArticles, selectedCountry } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const countryCode = selectedCountry?.countryCode || null;
        const response = await fetchArticles(1, countryCode);
        setArticles(response.articles as any);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load articles');
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
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
        <HomePageArticles/>
      </div>
      <HomePageRightNavbar staffPicks={MOCK_STAFF_PICKS} />
    </div>
  );
};

export default HomePage;