import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './../styles/guide.css';
import { AppContext } from '../context/AppContext';

const GuidePage: React.FC = () => {
  const { 
    selectedCountry, 
    selectedOptions, 
    guide, 
    setGuide 
  } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const [hasFetchedGuide, setHasFetchedGuideDate] = useState(false);

  useEffect(() => {
    const fetchGuide = async () => {
      // Redirect if required data is missing
      if (hasFetchedGuide || !selectedCountry?.countryCode || !selectedOptions?.length) {
        navigate('/');
        return;
      }

      try {
        const { countryCode, name: countryName } = selectedCountry;
        const response = await fetch('http://localhost:53195/api/guides', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          mode: 'cors',
          body: JSON.stringify({
            countryName,
            countryCode,
            selectedOptions: selectedOptions.map(opt => opt.id)
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch guide');
        }

        const data = await response.json();
        setGuide(data);
        setHasFetchedGuideDate(true);
      } catch (error) {
        console.log('Error fetching guide:', error);
        navigate('/');
      }
    };
    if(selectedCountry && selectedOptions && selectedOptions.length > 0) {
      fetchGuide();
    }
  }, [selectedCountry, selectedOptions, navigate]);

  const handleBack = () => {
    setGuide(null);
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
      <h1>{guide?.[0]?.header || `Travel Guide for ${selectedCountry?.name || 'Unknown Country'}`}</h1>
      {guide?.[0]?.content && (
        <div className="guide-content">
          {guide[0].content}
        </div>
      )}
    </div>
  );
};

export default GuidePage;