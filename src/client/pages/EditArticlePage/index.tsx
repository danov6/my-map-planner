import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { AppContext } from '../../context/AppContext';
import { Article } from '../../../shared/types';
import { fetchArticle, updateArticle } from '../../services/articles';
import { TRAVEL_TOPICS } from '../../constants';
import Spinner from '../../components/Spinner';
import DOMPurify from 'dompurify';
import './styles.css';
import { FaTimes } from 'react-icons/fa';

const EditArticlePage: React.FC = () => {
  const editorRef = useRef<any>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AppContext);
  const [article, setArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    headerImageUrl: '',
    topics: [] as string[]
  });
  const [selectedTopics, setSelectedTopics] = useState<{ value: string; label: string; }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topicInput, setTopicInput] = useState('');
  const [topicSuggestions, setTopicSuggestions] = useState<string[]>([]);
  const [showTopicSuggestions, setShowTopicSuggestions] = useState(false);

  
  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    const loadArticle = async () => {
      try {
        const data = await fetchArticle(id);
        if (data.author._id !== user?._id) {
          navigate(`/articles/${id}`);
          return;
        }
        setArticle(data);
        setFormData({
          title: data.title,
          subtitle: data.subtitle || '',
          content: DOMPurify.sanitize(data.content),
          headerImageUrl: data.headerImageUrl || '',
          topics: data.topics || []
        });

        setSelectedTopics(
          data.topics.map((topic: string) => ({
            value: topic,
            label: topic
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      loadArticle();
    } else {
      navigate('/login');
    }
  }, [id, navigate, isAuthenticated, user?._id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article || !editorRef.current) return;

    setIsSubmitting(true);
    setError(null);

    console.log('Topics before sanitization:', formData.topics);
    try {
      const content = editorRef.current.getContent();
      const sanitizedData = {
        ...formData,
        content: DOMPurify.sanitize(content),
      };
      await updateArticle(article._id, sanitizedData);
      navigate(`/articles/${article._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update article');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Spinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!article) return null;

  return (
    <div className="edit-article-page">
      <h1>Edit Article</h1>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="subtitle">Subtitle</label>
          <input
            type="text"
            id="subtitle"
            value={formData.subtitle}
            onChange={e => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <Editor
            apiKey={process.env.TINIFY_API_KEY}
            onInit={(evt, editor) => editorRef.current = editor}
            initialValue={formData.content}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | formatselect | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | image media link | help',
              content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px }',
              images_upload_url: process.env.SERVER_URL + '/api/media/images/upload',
              automatic_uploads: true,
              file_picker_types: 'image',
              images_reuse_filename: true
            }}
          />
        </div>

        <div className="form-group">
                  <label htmlFor="topics">Topics</label>
                  <div className="topics-input-container">
                    <input
                      type="text"
                      id="topics"
                      value={topicInput}
                      onChange={(e) => {
                        const input = e.target.value;
                        setTopicInput(input);
                        
                        // Filter suggestions
                        const filtered = TRAVEL_TOPICS.filter(
                          topic => 
                            topic.toLowerCase().includes(input.toLowerCase()) &&
                            !formData.topics.includes(topic)
                        );
                        setTopicSuggestions(filtered);
                        setShowTopicSuggestions(input.length > 0);
                      }}
                      onFocus={() => {
                        if (topicInput) {
                          setShowTopicSuggestions(true);
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => setShowTopicSuggestions(false), 200);
                      }}
                      placeholder="Type to search topics..."
                    />
                    {showTopicSuggestions && (
                      <ul className="topic-suggestions">
                        {topicSuggestions.map((topic) => (
                          <li
                            key={topic}
                            onClick={() => {
                              if (!formData.topics.includes(topic)) {
                                setFormData((prev: any) => ({
                                  ...prev,
                                  topics: [...prev.topics, topic]
                                }));
                              }
                              setTopicInput('');
                              setShowTopicSuggestions(false);
                            }}
                          >
                            {topic}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="selected-topics">
                    {formData.topics.map((topic: string) => (
                      <span key={topic} className="topic-tag">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev: any) => ({
                              ...prev,
                              topics: prev.topics.filter((t: any) => t !== topic)
                            }));
                          }}
                          className="remove-topic"
                        >
                          <FaTimes />
                        </button>
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Article'}
        </button>
      </form>
    </div>
  );
};

export default EditArticlePage;