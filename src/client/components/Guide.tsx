import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './../styles/guide.css';
import { AppContext } from '../context/AppContext';

const Guide: React.FC = () => {
  const { selectedCountry } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

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

export default Guide;