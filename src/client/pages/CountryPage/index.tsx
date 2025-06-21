import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchArticlesByCountry } from '../../services/articles';
import RightNavbar from '../../components/RightNavbar';
import CountryHeaderImage from './CountryHeaderImage';
import ArticlesSection from '../../components/ArticlesSection';
import Spinner from '../../components/Spinner';
import CountryMapComponent from '../../components/CountryMapComponent';
import { COUNTRY_LIST, AWS_DOMAIN } from '../../constants';
import { Country } from '../../../shared/types';
import '../../styles/countrypage.css';
// import { GeoJSON } from 'react-leaflet';

const CountryPage: React.FC = () => {
  const { id: countryCode } = useParams<{ id: string }>();
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const country = COUNTRY_LIST.find(
    country => country.countryCode === countryCode
  );
  const countryName = country?.name || countryCode;

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

  return (
    <div className="country-page">
      <div className="main-content">
        <h1>{countryName} Travel Guides</h1>
        {country?.headerImageUrl && <CountryHeaderImage countryName={countryName} countryHeaderImageUrl={country.headerImageUrl}/>}
        {/* <CountryMapComponent
          countryBounds={countryBounds}
          cities={country?.cities}
        /> */}
        {error ? <div className="error-message">{error}</div> : <ArticlesSection articles={articles} />}
      </div>
      <RightNavbar variant="country" />
    </div>
  );
};

export default CountryPage;