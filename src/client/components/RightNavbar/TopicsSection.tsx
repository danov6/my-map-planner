import { useTopicNavigation } from 'client/hooks/useTopicNavigation';
import Spinner from './../Spinner';

const TopicsSection: React.FC<any> = ({ topics, isLoading }) => {
    const handleTopicClick = useTopicNavigation();

    if(isLoading) return <Spinner />;

    return (
        <>
            <h3>Topics</h3>
            <div className="topics-list">
                {topics.map((topic: string) => (
                    <button className="topic-tag" key={topic} onClick={(e) => handleTopicClick(e, topic)}>{topic}</button>
                ))}
            </div>
        </>
    );
};

export default TopicsSection;