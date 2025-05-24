import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import './../styles/modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
}

const travelOptions = [
  { id: 'guide', text: 'I would like a travel guide here' },
];

const recommendationOptions = [
  { id: 'tourist', text: 'Tourist Attractions' },
  { id: 'food', text: 'Food/Beverage' },
  { id: 'adventure', text: 'Adventure Activities' },
  { id: 'budget', text: 'Budget Friendly' }
];

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title }) => {
    const { setSelectedOptions } = useContext(AppContext);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [selectedExperiences, setSelectedExperiences] = useState<Set<string>>(new Set());
    const navigate = useNavigate();

    const handleOptionToggle = (optionId: string) => {
      const newSelected = new Set(currentPage === 1 ? selectedItems : selectedExperiences);
      if (newSelected.has(optionId)) {
          newSelected.delete(optionId);
      } else {
          newSelected.add(optionId);
      }
      currentPage === 1 ? setSelectedItems(newSelected) : setSelectedExperiences(newSelected);
    };

    const handleBack = () => {
      setCurrentPage(1);
    };

    const handleNext = () => {
        setCurrentPage(2);
    };

    const handleFinalSubmit = () => {
      const selectedOpts = travelOptions
        .filter(opt => selectedItems.has(opt.id))
        .concat(recommendationOptions.filter(opt => selectedExperiences.has(opt.id)));
      setSelectedOptions(selectedOpts);
      
      // Create query string from selected options
      const queryString = selectedOpts
        .map(opt => `option=${encodeURIComponent(opt.id)}`)
        .join('&');
      
      // Navigate to guide page with selected options
      navigate(`/guide?${queryString}`);
      onClose();
    };

    const handleCloseButton = () => {
      setCurrentPage(1);
      setSelectedItems(new Set());
      setSelectedExperiences(new Set());
      onClose();
    }

    if (!isOpen) return null;

    return (
      <>
          <div className="modal-overlay" onClick={handleCloseButton} />
          <div className="modal-container">
              <div className="modal-header">
                  <h2>{title}</h2>
                  <button 
                      className="modal-close"
                      onClick={handleCloseButton}
                      aria-label="Close modal"
                  >
                      ×
                  </button>
              </div>
              <div className="modal-content">
                  <h3 className="modal-subheader">
                      {currentPage === 1 ? 'Select all that apply' : 'What kind of experiences interest you?'}
                  </h3>
                  
                  <div className="option-buttons">
                      {(currentPage === 1 ? travelOptions : recommendationOptions).map(option => (
                          <button
                              key={option.id}
                              className={`option-button ${
                                  (currentPage === 1 ? selectedItems : selectedExperiences).has(option.id) 
                                      ? 'selected' 
                                      : ''
                              }`}
                              onClick={() => handleOptionToggle(option.id)}
                              aria-pressed={(currentPage === 1 ? selectedItems : selectedExperiences).has(option.id)}
                          >
                              {option.text}
                          </button>
                      ))}
                  </div>

                  <div className="modal-actions">
                      {currentPage === 2 && (
                          <button 
                              className="modal-button secondary"
                              onClick={handleBack}
                          >
                              Back
                          </button>
                      )}
                      <button
                          className="modal-button primary"
                          onClick={currentPage === 1 ? handleNext : handleFinalSubmit}
                          disabled={currentPage === 1 
                              ? selectedItems.size === 0 
                              : selectedExperiences.size === 0}
                      >
                          {currentPage === 1 ? 'Next' : 'Submit'}
                      </button>
                  </div>
              </div>
          </div>
      </>
  );
};

export default Modal;