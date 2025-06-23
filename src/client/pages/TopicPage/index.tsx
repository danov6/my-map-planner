import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import ArticlesSection from '../../components/ArticlesSection';
import RightNavbar from '../../components/RightNavbar';
import Spinner from '../../components/Spinner';
import { fetchArticlesByTopic } from '../../services/articles';
import { Article } from '../../../shared/types';
import '../../styles/topicpage.css';

const TopicPage: React.FC = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  const { setArticles } = useContext(AppContext);
  const [topicArticles, setTopicArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert URL format back to display format
  const displayTopic = topic
    ?.replace(/-/g, ' ')
    .replace(/\band\b/g, '&')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  useEffect(() => {
    const loadTopicArticles = async () => {
      try {
        setIsLoading(true);
        const articles = await fetchArticlesByTopic(topic || '');
        setTopicArticles(articles);
        setArticles(articles);
      } catch (error) {
        setError('Failed to load articles');
        console.log('Error loading topic articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTopicArticles();
  }, [topic, setArticles]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="topic-page">
       <div className="topic-content">
      {isLoading ? <Spinner /> : 
        <>
            <h1>{displayTopic}</h1>
            <p>{topicArticles.length} articles</p>
            <ArticlesSection articles={topicArticles || []} />
        </>
      }
        </div>

      <RightNavbar variant="home" />
    </div>
  );
};

export default TopicPage;