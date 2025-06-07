import React, { useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Feature, Geometry } from 'geojson';
import { AppContext } from './../../context/AppContext';
import 'leaflet/dist/leaflet.css';
import countriesGeoJSON from './../../../../public/assets/countries.geo.json';
import { GeoJsonObject } from 'geojson';
import { COUNTRY_BLACKLIST, COUNTRY_COLORS } from '../../constants';

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
  const { selectedCountry, setSelectedCountry, isModalOpen, setIsModalOpen } = useContext(AppContext);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [selectedBounds, setSelectedBounds] = useState<number[][]>();

  // Memoize styles to prevent unnecessary recalculations
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

  // Memoize map configuration
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
  const isHighlighted = COUNTRY_BLACKLIST.includes(countryCode);
  
  return {
    ...baseCountryStyle,
    fillColor: isHighlighted ? COUNTRY_COLORS.BLACKLIST : COUNTRY_COLORS.WHITELIST,
    fillOpacity: hoveredCountry === feature?.properties?.name 
      ? 0.7 
      : isHighlighted 
        ? 0.4 
        : 0.3,
    weight: hoveredCountry === feature?.properties?.name ? 2 : 1
  };
}, [hoveredCountry, baseCountryStyle]);

  // Memoize click handler
  const handleCountryClick = useCallback((event: any) => {
    const countryName = event.target.feature.properties['name'];
    const countryCode = event.target.feature.properties['ISO3166-1-Alpha-3'];
    const layer = event.target;

    if(COUNTRY_BLACKLIST.includes(countryCode)) {
      return;
    }

    if (countryName && countryCode) {
      setSelectedCountry({
        name: countryName,
        countryCode
      });

      // Get bounds of the clicked country and adjust zoom
      const bounds = layer.getBounds();
      const adjustedBounds = bounds.pad(0.1);
      setSelectedBounds(adjustedBounds);
      //setIsModalOpen(true);
    }
  }, [setSelectedCountry]);

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

  const geoJsonData = useMemo(() => countriesGeoJSON as GeoJsonObject, []);

  return (
    <div className="map-container">
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
      {tooltip && (
        <div className="country-tooltip" style={tooltipStyle}>
          {tooltip.name}
        </div>
      )}
    </div>
  );
};

export default React.memo(MapComponent);