import React, { useState, useEffect } from 'react';
import { TravelOption } from './context/AppContext';
import MapComponent from './components/MapComponent';
import Modal from './components/Modal';
import BlogList from './components/BlogList';
import { AppContext } from './context/AppContext';
import { BlogPost } from '../shared/types';
import './styles/global.css';
import './styles/modal.css';

const App: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<{ countryCode: string, name: string } | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<TravelOption[]>([]);
  
  useEffect(() => {
    if (selectedCountry) {
      const countryCode = selectedCountry.countryCode;
      if(countryCode){
        //fetchBlogsForCountry(countryCode);
      }
    }
  }, [selectedCountry]);
  
  const fetchBlogsForCountry = async (countryCode: string) => {
    try {
      const response = await fetch(`http://localhost:53195/api/blogs/country/${countryCode}`);
      const data = await response.json();
      console.log('Giordano', data)
      setBlogs(data);
    } catch (error) {
      //console.error('Error fetching blogs:', error);
    }
  };
  
  return (
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
          <h1>Travel Blog Explorer</h1>
          <br/>
          <h3>Select a country to get started</h3>
        </header>
        <main>
          <div>
            <MapComponent />
            {/* {selectedCountry && <BlogList />} */}
          </div>
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
  );
};

export default App;