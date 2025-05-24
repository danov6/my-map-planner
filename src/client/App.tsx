import React, { useState, useEffect } from 'react';
import { TravelOption } from './context/AppContext';
import MapComponent from './components/MapComponent';
import Modal from './components/Modal';
import BlogList from './components/BlogList';
import Navbar from './components/Navbar';
import { AppContext } from './context/AppContext';
import { BlogPost } from '../shared/types';
import './styles/global.css';
import './styles/modal.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Guide from './components/Guide';

const App: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<{ countryCode: string, name: string } | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<TravelOption[]>([]);

  const formatQueryString = (options: TravelOption[]) => {
    return options.map(option => `option=${encodeURIComponent(option.id)}`).join('&');
  };

  const parseQueryString = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const options: TravelOption[] = [];
    
    queryParams.forEach((value, key) => {
      if (key === 'option') {
        options.push({
          id: decodeURIComponent(value),
          text: '' // You might want to map these IDs to their text values
        });
      }
    });

    if (options.length > 0) {
      console.log('Giordano', options);
      setSelectedOptions(options);
    }
  };

  useEffect(() => {
    parseQueryString();
  }, []);

  useEffect(() => {
    if (selectedOptions?.length > 0) {
      console.log('Giordano', formatQueryString(selectedOptions));
    }
  }, [selectedOptions]);
  
  return (
    <Router>
      <AppContext.Provider value={{ 
        selectedCountry, 
        blogs, 
        setSelectedCountry,
        isModalOpen,
        setIsModalOpen,
        selectedOptions,
        setSelectedOptions
      }}>
        <div className="app-container">
          <header>
            <Navbar />
          </header>
          <main>
          <Routes>
              <Route path="/" element={
                <>
                  <h3>Select a country to get started</h3>
                  <div>
                    <MapComponent />
                  </div>
                </>
              } />
              <Route path="/guide" element={<Guide />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedCountry?.name || 'Country Details'}
        >
          <div>
            <h3>{selectedCountry?.name}</h3>
            {/* Add more content here */}
          </div>
        </Modal>
        </div>
      </AppContext.Provider>
    </Router>
  );
};

export default App;