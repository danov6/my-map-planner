import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './../styles/guide.css';
import { AppContext } from '../context/AppContext';
import { isFloat32Array } from 'node:util/types';

const GuidePage: React.FC = () => {
  const { selectedCountry, selectedOptions } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  useEffect(() => {
    const fetchGuide = async () => {
      // Redirect if required data is missing
      if (!selectedCountry?.countryCode || !selectedOptions?.length) {
        navigate('/');
        return;
      }

      try {
        const response = await fetch('http://localhost:53195/api/guides', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            countryCode: selectedCountry.countryCode,
            selectedOptions: selectedOptions.map(opt => opt.id)
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch guide');
        }

        const data = await response.json();
        // Handle the response data here
        console.log('Guide data:', data);
      } catch (error) {
        console.error('Error fetching guide:', error);
        navigate('/');
      }
    };
    if(selectedCountry && selectedOptions && selectedOptions.length > 0) {
      fetchGuide();
    }
  }, [selectedCountry, selectedOptions, navigate]);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="guide-container">
      <button 
        className="back-button"
        onClick={handleBack}
        aria-label="Back to map"
      >
        ← Back to Map
      </button>
      <h1>Travel Guide for {selectedCountry ? selectedCountry.name : 'Unknown Country'}</h1>
      {/* Add your guide content here */}
    </div>
  );
};

export default GuidePage;