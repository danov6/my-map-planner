import React, { useState, useEffect } from 'react';
import './../styles/guide.css';
import MapComponent from './../components/MapComponent';
import Spinner from './../components/Spinner';

const HomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate map loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    });

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <h3>Select a country to get started</h3>
      <div>
        {isLoading ? <Spinner /> : <MapComponent />}
      </div>
    </>
  );
};

export default HomePage;