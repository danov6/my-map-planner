import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const BlogList: React.FC = () => {
  const { selectedCountry, blogs } = useContext(AppContext);

  if (!selectedCountry || blogs.length === 0) {
    return (
      <div className="blog-list-container">
        <h2>No blogs available for this country</h2>
      </div>
    );
  }

  return (
    <div className="blog-list-container">
      <h2>Blogs about {selectedCountry}</h2>
      <div className="blog-grid">
        {blogs.map(blog => (
          <div key={blog.id} className="blog-card">
            {blog.imageUrl && (
              <div className="blog-image">
                <img src={blog.imageUrl} alt={blog.title} />
              </div>
            )}
            <div className="blog-content">
              <h3>{blog.title}</h3>
              <p className="blog-date">{new Date(blog.publishDate).toLocaleDateString()}</p>
              <p className="blog-excerpt">
                {blog.content.substring(0, 150)}...
              </p>
              <button className="read-more-btn">Read More</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;