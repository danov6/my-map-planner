import React from 'react';
import { AWS_DOMAIN } from '../../constants';

interface CountryCityGuidesProps {
  cities: string | undefined;
}

const CountryCityGuides: React.FC<CountryCityGuidesProps> = ({ cities }) => {
  return (
    <div className="country-city-guide-container">
    </div>
  );
};

export default CountryCityGuides;