import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { Article } from '../../../shared/types';
import { fetchArticle, updateArticle } from '../../services/articles';
import Spinner from '../../components/Spinner';
import './styles.css';

const EditArticlePage: React.FC = () => {
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    const loadArticle = async () => {
      try {
        const data = await fetchArticle(id);
        if (data.author._id !== user?._id) {
          navigate(`/article?id=${id}`);
          return;
        }
        setArticle(data);
        setFormData({
          title: data.title,
          subtitle: data.subtitle || '',
          content: data.content,
          headerImageUrl: data.headerImageUrl || '',
          topics: data.topics || []
        });
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
    if (!article) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await updateArticle(article._id, formData);
      navigate(`/article?id=${article._id}`);
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
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={formData.content}
            onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
            required
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating...' : 'Update Article'}
        </button>
      </form>
    </div>
  );
};

export default EditArticlePage;