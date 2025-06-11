import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { AppContext } from '../../context/AppContext';
import { COUNTRY_LIST, TRAVEL_TOPICS } from '../../constants';
import { FaTimes } from 'react-icons/fa';
import './styles.css';
import { createArticle } from '../../services/articles';
import { uploadImage } from '../../services/media';

const CreateArticlePage: React.FC = () => {
  const editorRef = useRef<any>(null);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [countrySuggestions, setCountrySuggestions] = useState<Array<{ name: string; countryCode: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [topicInput, setTopicInput] = useState('');
  const [topicSuggestions, setTopicSuggestions] = useState<string[]>([]);
  const [showTopicSuggestions, setShowTopicSuggestions] = useState(false);
  const [formData, setFormData] = useState<any>({
    title: '',
    subtitle: '',
    headerImageUrl: '',
    content: '',
    topics: [],
    country: '',
    displayCountry: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorRef.current) return;

    if (!formData.country) {
      setError('Please select a valid country from the suggestions');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const content = editorRef.current.getContent();
    
    try {
      const { displayCountry, ...submitData } = formData;
      const data = await createArticle(submitData, content);
      navigate(`/articles/${data._id}`);
    } catch (err) {
      if (err instanceof Error && err.message === 'UNAUTHORIZED') {
        navigate('/');
        return;
      }
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const { imageUrl } = await uploadImage(formData);
      setFormData((prev: any) => ({ ...prev, headerImageUrl: imageUrl }));
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

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
            onChange={e => setFormData((prev: any) => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="subtitle">Subtitle</label>
          <input
            type="text"
            id="subtitle"
            value={formData.subtitle}
            onChange={e => setFormData((prev: any) => ({ ...prev, subtitle: e.target.value }))}
          />
        </div>

        <div className="form-group">
          <label htmlFor="country">Country *</label>
          <div className="country-input-container">
            <input
              type="text"
              id="country"
              value={formData.displayCountry}
              onChange={e => {
                const input = e.target.value;
                setFormData((prev: any) => ({ ...prev, displayCountry: input, country: '' }));
                
                // Filter country suggestions
                const filtered = COUNTRY_LIST.filter(country =>
                  country.name.toLowerCase().includes(input.toLowerCase())
                );
                setCountrySuggestions(filtered);
                setShowSuggestions(input.length > 0);
              }}
              onFocus={() => {
                if (formData.displayCountry) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              required
            />
            {showSuggestions && (
              <ul className="country-suggestions">
                {countrySuggestions.map(country => (
                  <li
                    key={country.countryCode}
                    onClick={() => {
                      setFormData((prev: any) => ({ 
                        ...prev, 
                        country: country.countryCode,
                        displayCountry: country.name 
                      }));
                      setShowSuggestions(false);
                    }}
                  >
                    {country.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="headerImage">Header Image</label>
          <div className="header-image-upload">
            <input
              type="file"
              id="headerImage"
              accept="image/*"
              onChange={handleImageUpload}
              className="header-image-input"
            />
            {isUploading && <span className="upload-status">Uploading...</span>}
          </div>
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Header preview" />
              <button
                type="button"
                className="remove-image"
                onClick={() => {
                  setImagePreview(null);
                  setFormData((prev: any) => ({ ...prev, headerImageUrl: '' }));
                }}
              >
                Remove Image
              </button>
            </div>
          )}
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