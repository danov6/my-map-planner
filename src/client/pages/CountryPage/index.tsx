import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchArticlesByCountry } from '../../services/articles';
import RightNavbar from '../../components/RightNavbar';
import ArticlesSection from '../../components/ArticlesSection';
import Spinner from '../../components/Spinner';
import { COUNTRY_LIST } from '../../constants';
import './styles.css';

const CountryPage: React.FC = () => {
  const { id: countryCode } = useParams<{ id: string }>();
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const countryName = COUNTRY_LIST.find(
    country => country.countryCode === countryCode
  )?.name || countryCode;

  useEffect(() => {
    const loadCountryArticles = async () => {
      try {
        const data = await fetchArticlesByCountry(countryCode!);
        setArticles(data.articles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load articles');
      } finally {
        setIsLoading(false);
      }
    };

    if (countryCode) {
      loadCountryArticles();
    }
  }, [countryCode]);

  if (isLoading) return <Spinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="country-page">
      <div className="main-content">
        <h1>{countryName} Travel Guides</h1>
        <ArticlesSection articles={articles} />
      </div>
      <RightNavbar variant="home" />
    </div>
  );
};

export default CountryPage;