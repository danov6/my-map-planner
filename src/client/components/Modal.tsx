import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import './../styles/modal.css'; // Import your CSS file for styling

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
}

const travelOptions = [
    { id: 'visited', text: 'I have visited this country' },
    { id: 'living', text: 'I am living in this country' },
    { id: 'wantToVisit', text: 'I want to visit this country' },
    { id: 'planning', text: 'I am planning a trip here' }
];

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title }) => {
    const { setSelectedOptions } = useContext(AppContext);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

    const handleOptionToggle = (optionId: string) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(optionId)) {
          newSelected.delete(optionId);
        } else {
          newSelected.add(optionId);
        }
        setSelectedItems(newSelected);
    };

    const handleSubmit = () => {
        const selectedOpts = travelOptions.filter(opt => 
          selectedItems.has(opt.id)
        );
        setSelectedOptions(selectedOpts);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
          <div className="modal-overlay" onClick={onClose} />
          <div className="modal-container">
            <div className="modal-header">
              <h2>{title}</h2>
              <button 
                className="modal-close"
                onClick={onClose}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <h3 className="modal-subheader">Select all that apply</h3>
              
              <div className="option-buttons">
                {travelOptions.map(option => (
                  <button
                    key={option.id}
                    className={`option-button ${selectedItems.has(option.id) ? 'selected' : ''}`}
                    onClick={() => handleOptionToggle(option.id)}
                    aria-pressed={selectedItems.has(option.id)}
                  >
                    <span className="checkbox">
                      {selectedItems.has(option.id) ? '✓' : ''}
                    </span>
                    {option.text}
                  </button>
                ))}
              </div>
    
              <div className="modal-actions">
                <button 
                  className="modal-button secondary"
                  onClick={onClose}
                >
                  Close
                </button>
                <button
                  className="modal-button primary"
                  onClick={handleSubmit}
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