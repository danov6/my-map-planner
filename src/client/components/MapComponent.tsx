import React, { useContext } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { AppContext } from '../context/AppContext';
import 'leaflet/dist/leaflet.css';
import countriesGeoJSON from '../../../public/assets/countries.geo.json';

// Add GeoJSON feature type
interface GeoJSONFeature {
  type: string;
  properties: {
    name: string;
    ISO_A2: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

const MapComponent: React.FC = () => {
  const { setSelectedCountry } = useContext(AppContext);
  
  const handleCountryClick = (event: any) => {
    const layer = event.target;
    const country = layer.feature;
    
    if (country && country.properties) {
      setSelectedCountry({
        name: country.properties.name,
        code: country.properties.ISO_A2
      });
      console.log(`Selected country: ${country.properties.name}`);
    }
  };

  const onEachFeature = (feature: GeoJSONFeature, layer: any) => {
    layer.on({
      click: handleCountryClick,
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          fillOpacity: 0.7,
          weight: 2
        });
      },
      mouseout: (e: any) => {
        const layer = e.target;
        layer.setStyle(countryStyle);
      }
    });
  };

  // Add map styling
  const countryStyle = {
    fillColor: '#4a90e2',  // Updated color for dark mode
    weight: 1,
    opacity: 1,
    color: '#666',         // Updated border color for dark mode
    fillOpacity: 0.3
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
          data={countriesGeoJSON}
          style={countryStyle}
          onEachFeature={onEachFeature}
          eventHandlers={{
            click: handleCountryClick,
          }}
        />
      </MapContainer>
    </div>
  );
};

export default MapComponent;