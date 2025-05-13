import React, { useContext } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { AppContext } from '../context/AppContext';
import 'leaflet/dist/leaflet.css';

const MapComponent: React.FC = () => {
  const { setSelectedCountry } = useContext(AppContext);
  
  const handleCountryClick = (event: any) => {
    const countryCode = event.target.feature.properties.ISO_A2;
    setSelectedCountry(countryCode);
  };
  
  return (
    <div className="map-container">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoJSON
          data={require('/assets/countries.geo.json')}
          eventHandlers={{
            click: handleCountryClick,
          }}
        />
      </MapContainer>
    </div>
  );
};

export default MapComponent;