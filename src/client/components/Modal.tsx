import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import './../styles/modal.css';
import { recommendationOptions } from '../constants';
import { 
  FaUmbrellaBeach, 
  FaHiking, 
  FaUtensils, 
  FaCamera, 
  FaMusic,
  FaPaintBrush,
  FaShoppingBag,
  FaLandmark
} from 'react-icons/fa';

// Create an icon mapping object
const iconMapping = {
  'beach': FaUmbrellaBeach,
  'hiking': FaHiking,
  'food': FaUtensils,
  'photography': FaCamera,
  'music': FaMusic,
  'art': FaPaintBrush,
  'shopping': FaShoppingBag,
  'history': FaLandmark,
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title }) => {
    const { setSelectedOptions } = useContext(AppContext);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const navigate = useNavigate();

    const handleOptionToggle = (optionId: string) => {
      const newSelected = new Set(selectedItems);
      if (newSelected.has(optionId)) {
          newSelected.delete(optionId);
      } else {
          newSelected.add(optionId);
      }
      setSelectedItems(newSelected);
    };

    const handleFinalSubmit = () => {
      const selectedOpts = travelOptions.filter(opt => selectedItems.has(opt.id));
      setSelectedOptions(selectedOpts);
      
      // Create query string from selected options
      const queryString = selectedOpts
        .map(opt => `option=${encodeURIComponent(opt.id)}`)
        .join('&');
      
      // Navigate to guide page with selected options
      navigate(`/guide?${queryString}`);
      handleClose();
    };

    const handleClose = () => {
      setSelectedItems(new Set());
      onClose();
    }

    if (!isOpen) return null;

    return (
      <>
          <div className="modal-overlay" onClick={handleClose} />
          <div className="modal-container">
              <div className="modal-header">
                  <h2>Let's curate a travel guide for {title}</h2>
                  <button 
                      className="modal-close"
                      onClick={handleClose}
                      aria-label="Close modal"
                  >
                      ×
                  </button>
              </div>
              <div className="modal-content">
                  <h4 className="modal-subheader">Select all that apply</h4>
                  
                  <div className="option-buttons">
                      {recommendationOptions.map(option => {
                          const IconComponent = iconMapping[option.id as keyof typeof iconMapping];
                          return (
                              <button
                                  key={option.id}
                                  className={`option-button ${
                                      selectedItems.has(option.id) ? 'selected' : ''
                                  }`}
                                  onClick={() => handleOptionToggle(option.id)}
                                  aria-pressed={selectedItems.has(option.id)}
                              >
                                  {IconComponent && <IconComponent className="option-icon" />}
                                  <span>{option.text}</span>
                              </button>
                          );
                      })}
                  </div>

                  <div className="modal-actions">
                      <button
                          className="modal-button primary"
                          onClick={handleFinalSubmit}
                          disabled={selectedItems.size === 0}
                      >
                          Submit
                      </button>
                  </div>
              </div>
          </div>
      </>
    );
};

export default Modal;