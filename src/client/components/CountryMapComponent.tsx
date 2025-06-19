import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer } from 'react-leaflet';
import { AppContext } from '../context/AppContext';
import { getCountryBounds } from '../utils';
import './styles.css';

const CountryMapComponent: React.FC = () => {
  const { selectedCountry } = useContext(AppContext);
  const { countryCode: urlCountryCode } = useParams();

  // Use context or fallback to URL param
  const countryCode = selectedCountry?.countryCode || urlCountryCode?.toUpperCase();

  if (!countryCode) {
    return <div>No country selected</div>;
  }

  const bounds = getCountryBounds(countryCode);

  if (!bounds) {
    console.error(`Could not get bounds for country: ${countryCode}`);
    return <div>Could not load map</div>;
  }

  const mapBounds: L.LatLngBoundsExpression = [
    [bounds.south, bounds.west],
    [bounds.north, bounds.east]
  ];

  return (
    <div className="country-map-container">
      <MapContainer
        bounds={mapBounds}
        scrollWheelZoom={false}
        zoomControl={false}
        dragging={false}
        className="country-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
};

export default CountryMapComponent;