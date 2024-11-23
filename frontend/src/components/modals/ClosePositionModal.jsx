import './ClosePositionModal.css';

const ClosePositionModal = ({ isOpen, onClose, closePosition, text, header, actionText }) => {
  if (!isOpen) return null;
  return (
    <div className="overlay">
      <div className="backdrop" onClick={onClose} />
      <div className="container">
        <div className="content">
          <div className="header">{header}</div>

          <div className="popup-body">
            <h3>{actionText}</h3>
            <p>{text}</p>
          </div>

          <div className="popup-buttons">
            <button onClick={onClose} className="popup-button popup-button-cancel">
              Cancel
            </button>
            <button onClick={closePosition} className="popup-button popup-button-close">
              Close Active Position
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClosePositionModal;
