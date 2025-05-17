import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import BlogList from './components/BlogList';
import { AppContext } from './context/AppContext';
import { BlogPost } from '../shared/types';
import './styles/global.css';  // Add this import

const App: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  
  useEffect(() => {
    if (selectedCountry) {
      fetchBlogsForCountry(selectedCountry);
    }
  }, [selectedCountry]);
  
  const fetchBlogsForCountry = async (countryCode: string) => {
    try {
      //const response = await fetch(`/api/blogs/country/${countryCode}`);
      //const data = await response.json();
      //setBlogs(data);
      console.log('Giordano', countryCode);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };
  
  return (
    <AppContext.Provider value={{ selectedCountry, blogs, setSelectedCountry }}>
      <div className="app-container">
        <header>
          <h1>Travel Blog Explorer</h1>
        </header>
        <main>
          <MapComponent />
          {selectedCountry && <BlogList />}
        </main>
      </div>
    </AppContext.Provider>
  );
};

export default App;