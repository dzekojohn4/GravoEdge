/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import './popup.css';

const StyledPopup = ({ isOpen, onClose, onClosePosition }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-backdrop" onClick={onClose} />
      <div className="popup-container">
        <div className="popup-content">
          <div className="popup-header">
            Open New Position
          </div>
          
          <div className="popup-body">
            <h2>Do you want to open new<br />a position?</h2>
            <p>
              You have already opened a position. Please close
              active position to open a new one. Click the 'Close
              Active Position' button to continue.
            </p>
          </div>

          <div className="popup-buttons">
            <button
              onClick={onClose}
              className="popup-button popup-button-cancel"
            >
              Cancel
            </button>
            <button
              onClick={onClosePosition}
              className="popup-button popup-button-close"
            >
              Close Active Position
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyledPopup;