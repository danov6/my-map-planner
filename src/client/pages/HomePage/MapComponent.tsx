import React, { useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Feature, Geometry } from 'geojson';
import { AppContext } from './../../context/AppContext';
import 'leaflet/dist/leaflet.css';
import countriesGeoJSON from './../../../../public/assets/countries.geo.json';
import { GeoJsonObject } from 'geojson';
import { COUNTRY_BLACKLIST, COUNTRY_COLORS } from '../../constants';
import { fetchUniqueCountries } from '../../services/articles';
import { useNavigate } from 'react-router-dom';

interface TooltipState {
  name: string;
  x: number;
  y: number;
}

const MapController: React.FC<{ bounds?: number[][] }> = ({ bounds }) => {
  const map = useMap();
  
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds as [number, number][]);
    }
  }, [bounds, map]);

  return null;
};

const MapComponent: React.FC = () => {
  const { selectedCountry, setSelectedCountry, isModalOpen, setIsModalOpen, highlightedMapCountries, setHighlightedMapCountries } = useContext(AppContext);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [selectedBounds, setSelectedBounds] = useState<number[][]>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const baseCountryStyle = useMemo(() => ({
    fillColor: '#4a90e2',
    weight: 1,
    opacity: 1,
    color: '#666',
    fillOpacity: 0.3,
    strokeWidth: 1,
    strokeOpacity: 1,
    smoothFactor: 2,
    interactive: true,
    renderer: new L.Canvas(),
    pane: 'overlayPane'
  }), []);

  const mapConfig = useMemo(() => ({
    center: [20, 0] as [number, number],
    zoom: 2,
    maxZoom: 6,
    minZoom: 2,
    style: { height: '500px', width: '100%' },
    zoomControl: true,
    zoomAnimation: true,
    markerZoomAnimation: true
  }), []);

  // Memoize tooltip styles
  const tooltipStyle = useMemo(() => ({
    position: 'fixed' as const,
    left: (tooltip?.x ?? 0) + 10,
    top: (tooltip?.y ?? 0) + 10,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '14px',
    pointerEvents: 'none' as const
  }), [tooltip?.x, tooltip?.y]);

  // Memoize style generator function
  const getCountryStyle = useCallback((feature: Feature<Geometry, any> | undefined) => {
    const countryCode = feature?.properties['ISO3166-1-Alpha-3'];
    const isHighlighted = highlightedMapCountries?.includes(countryCode);
    
    return {
      ...baseCountryStyle,
      fillColor: isHighlighted ? COUNTRY_COLORS.WHITELIST : COUNTRY_COLORS.BLACKLIST,
      fillOpacity: hoveredCountry === feature?.properties?.name 
        ? 0.7 
        : isHighlighted 
          ? 0.6 
          : 0.3,
      weight: hoveredCountry === feature?.properties?.name ? 2 : 1
    };
  }, [hoveredCountry, baseCountryStyle, highlightedMapCountries]); // Add highlightedCountries to dependencies

  // Memoize click handler
  const handleCountryClick = useCallback((event: any) => {
    const countryName = event.target.feature.properties['name'];
    const countryCode = event.target.feature.properties['ISO3166-1-Alpha-3'];
    const layer = event.target;

    if (countryName && countryCode) {
      setSelectedCountry({
        name: countryName,
        countryCode
      });
      if (highlightedMapCountries?.includes(countryCode)) {
        navigate(`/countries/${countryCode}`);
        return;
      }
    }
  }, [navigate, setSelectedCountry, highlightedMapCountries]);

  // Memoize feature handler
  const onEachFeature = useCallback((feature: Feature<Geometry, any>, layer: any) => {
      layer.on({
        click: handleCountryClick,
        mouseover: (e: any) => {
          setHoveredCountry(feature.properties?.name || null);
          const point = e.originalEvent;
          setTooltip({
            name: feature.properties?.name || '',
            x: point.clientX,
            y: point.clientY
          });
        },
        mouseout: () => {
          setHoveredCountry(null);
          setTooltip(null);
        }
      });
    }, [handleCountryClick]);

  useEffect(() => {
    const loadHighlightedCountries = async () => {
      try {
        const countries = await fetchUniqueCountries();
        setHighlightedMapCountries(countries);
      } catch (err) {
        setError('Failed to load country data');
        console.error('Error loading countries:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadHighlightedCountries();
  }, [setHighlightedMapCountries]);

  const geoJsonData = useMemo(() => countriesGeoJSON as GeoJsonObject, []);

  return (
    <div className="map-container">
      {isLoading ? (
        <div className="map-loading">Loading map data...</div>
      ) : (
        <MapContainer {...mapConfig}>
          {selectedBounds && <MapController bounds={selectedBounds} />}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            tileSize={256}
            updateWhenIdle={true}
            updateWhenZooming={false}
            keepBuffer={2}
          />
          <GeoJSON
            data={geoJsonData}
            style={getCountryStyle}
            onEachFeature={onEachFeature}
          />
        </MapContainer>
      )}
      {tooltip && (
        <div className="country-tooltip" style={tooltipStyle}>
          {tooltip.name}
        </div>
      )}
    </div>
  );
};

export default React.memo(MapComponent);