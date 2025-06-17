import { useNavigate } from 'react-router-dom';

export const useTopicNavigation = () => {
  const navigate = useNavigate();

  const handleTopicClick = (e: React.MouseEvent<HTMLElement>, topic: string) => {
    e.stopPropagation(); // Prevent parent click events
    
    // Convert topic to URL friendly format
    const topicUrl = topic
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    navigate(`/topics/${topicUrl}`);
  };

  return handleTopicClick;
};