import React from 'react'

const CountryCitiesSection: React.FC<any> = ({ cities }) => {
  return (
    <div className="cities-section-container">
        {cities}
    </div>
  )
};

export default CountryCitiesSection;