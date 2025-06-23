import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchArticlesByCountry } from '../../services/articles';
import RightNavbar from '../../components/RightNavbar';
import CountryHeaderImage from './CountryHeaderImage';
import ArticlesSection from '../../components/ArticlesSection';
import Spinner from '../../components/Spinner';
import CountryMapComponent from '../../components/CountryMapComponent';
import CountryCitiesSection from './CountryCitiesSection';
import { COUNTRY_LIST, AWS_DOMAIN } from '../../constants';
import { Country } from '../../../shared/types';
import { useNavigate } from 'react-router-dom';
import '../../styles/countrypage.css';
// import { GeoJSON } from 'react-leaflet';

const CountryPage: React.FC = () => {
  const navigate = useNavigate();
  const { id: countryCode } = useParams<{ id: string }>();
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [isArticlesLoading, setIsArticlesLoading] = useState(true);

  const country: Country | any  = COUNTRY_LIST.find(
    country => country.countryCode === countryCode
  ) || {};
  const countryName = country?.countryName || countryCode;
  const { cities, headerImageUrl } = country;

  const loadCountryArticles = async (page: number) => {
      try {
        const data = await fetchArticlesByCountry(countryCode!, page);
        setArticles(data.articles);
        if(data?.pagination?.totalPages > 1){
          setPagination(data?.pagination);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load articles');
      } finally {
        setIsArticlesLoading(false);
        setIsLoading(false);
      }
  };

  const onPageChange = (page: number) => {
    setIsArticlesLoading(true);
    loadCountryArticles(page);
  };

  useEffect(() => {
    if (countryCode) {
      loadCountryArticles(1);
    } else {
      navigate('/');
    }
  }, [countryCode]);

  if (isLoading) return <Spinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="country-page">
      <div className="main-content">
        <h1>{countryName} Travel Guides</h1>
        {headerImageUrl && <CountryHeaderImage countryName={countryName} countryHeaderImageUrl={headerImageUrl}/>}
        {/* <CountryMapComponent
          countryBounds={countryBounds}
          cities={country?.cities}
        /> */}
        {cities && <CountryCitiesSection cities={cities} />}
        {isArticlesLoading ? <Spinner /> : <ArticlesSection articles={articles || []} pagination={pagination} onPageChange={onPageChange}/>}
      </div>
      <RightNavbar variant="country" />
    </div>
  );
};

export default CountryPage;