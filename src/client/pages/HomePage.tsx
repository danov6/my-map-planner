import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './../styles/guide.css';
import { AppContext } from '../context/AppContext';
import MapComponent from './../components/MapComponent';

const GuidePage: React.FC = () => {
  const { selectedCountry } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <>
        <h3>Select a country to get started</h3>
        <div>
        <MapComponent />
        </div>
    </>
  );
};

export default GuidePage;