import { useLocation } from 'react-router-dom';
import { useEffect, useState, useContext, use } from 'react';
import { fetchTopics } from '../../services/articles';
import { AppContext } from '../../context/AppContext';
import TopicsSection from './TopicsSection';
import FlightsSection from './FlightsSection';

const RightNavbar: React.FC<any> = ({ variant }) => {
  const location = useLocation();
  const { user } = useContext(AppContext);
  const [topics, setTopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        let params: Record<string, string> = {};
        const countryMatch = location.pathname.match(/^\/countries\/([A-Z]{3})$/i);
        if (variant === 'country' && countryMatch) {
          params.country = countryMatch[1].toUpperCase();
        } else if (location.pathname.startsWith('/topics/')) {
          const topicSlug = location.pathname.replace('/topics/', '');
          params.topic = topicSlug
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
        } else if (location.pathname.startsWith('/profile') && user) {
          params.likedBy = user._id;
        }

        const fetchedTopics = await fetchTopics(params);
        setTopics(fetchedTopics);
      } catch (err) {
        setTopics([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadTopics();
  }, []);

  return (
    <div className="right-navbar">
      <TopicsSection topics={topics} isLoading={isLoading} />
      <FlightsSection />
    </div>
  );
};

export default RightNavbar;