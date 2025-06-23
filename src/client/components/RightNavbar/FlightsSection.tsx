import { useContext } from 'react';
import { FLIGHT_LIST_URLS } from '../../constants';
import { AppContext } from '../../context/AppContext';

const FlightsSection: React.FC<any> = () => {
    const { isFlightsSectionClosed, setIsFlightsSectionClosed } = useContext(AppContext);
    const handleClose = () => {
        setIsFlightsSectionClosed(true);
    }
    const handleLinkClick = (url: string) => {
        window?.open(url, '_blank')?.focus();
    };

    if(isFlightsSectionClosed) return <div></div>;

    return (
        <div className="flights-widget-container">
            <div className="flights-widget-close-button" onClick={handleClose}>X</div>
            <h3>Flights</h3>
            {FLIGHT_LIST_URLS.map((flight, index) => (
                <div className="flights-action-button" onClick={() => handleLinkClick(flight.url)} key={index}><img className="flights-action-button-icon" src={flight.imageUrl}/><div className="flights-action-button-text">{flight.name}</div></div>
            ))}
        </div>
    );
};

export default FlightsSection;