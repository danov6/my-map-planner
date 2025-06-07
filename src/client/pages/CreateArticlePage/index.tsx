import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { AppContext } from '../../context/AppContext';
import './styles.css';

interface ArticleForm {
  title: string;
  subtitle: string;
  content: string;
  headerImage?: string;
  categories: string[];
  topics: string[];
}

const CreateArticlePage: React.FC = () => {
  const editorRef = useRef<any>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AppContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ArticleForm>({
    title: '',
    subtitle: '',
    content: '',
    categories: [],
    topics: []
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorRef.current) return;

    setIsSubmitting(true);
    setError(null);

    const content = editorRef.current.getContent();
    
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          content
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/');
          return;
        }
        throw new Error('Failed to create article');
      }

      const data = await response.json();
      navigate(`/article?id=${data._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-article-page">
      <h1>Create New Article</h1>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
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
              images_upload_url: process.env.SERVER_URL +'/api/media/images/upload',
              automatic_uploads: true,
              file_picker_types: 'image',
              images_reuse_filename: true
            }}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Article'}
        </button>
      </form>
    </div>
  );
};

export default CreateArticlePage;