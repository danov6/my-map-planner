import { FLIGHT_LIST_URLS } from '../constants';

const FlightsSection: React.FC<any> = () => {
    const handleLinkClick = (url: string) => {
        window?.open(url, '_blank')?.focus();
    };
  return (
    <div className="flights-widget-container">
        <h3>Flights</h3>
        {FLIGHT_LIST_URLS.map((flight, index) => (
            <div className="flights-action-button" onClick={() => handleLinkClick(flight.url)} key={index}><img className="flights-action-button-icon" src={flight.imageUrl}/>{flight.name}</div>
        ))}
    </div>
  );
};

export default FlightsSection;