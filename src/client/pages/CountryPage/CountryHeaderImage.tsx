import React from 'react';
import { AWS_DOMAIN } from '../../constants';

interface CountryHeaderImageProps {
  countryHeaderImageUrl: string | undefined;
  countryName: string | undefined;
}

const CountryHeaderImage: React.FC<CountryHeaderImageProps> = ({ countryHeaderImageUrl, countryName }) => {
  return (
    <div className="country-header-image-container">
      <img src={AWS_DOMAIN + countryHeaderImageUrl} alt={countryName} />
    </div>
  );
};

export default CountryHeaderImage;