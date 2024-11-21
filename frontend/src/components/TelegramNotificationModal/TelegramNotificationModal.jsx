import React from 'react'
import './telegramNotificationModal.css'

const TelegramNotificationModal = ({  onClose }) => {
  return (
    <div className="notification-overlay">
    <div className="notification-wrapper">
      <div className="notification-box">
        <div className="notification-content">
          <div className="notification-title">
            Telegram Notification
          </div>
          <h2>
            Do you want to enable telegram <br />
            notification bot?
          </h2>
          <p>
            This will allow you to receive quick notifications on your telegram
            line in real-time. You can disable this setting anytime.
          </p>
        </div>
        <div className="notification-actions">
          <button onClick={onClose} className="notification-btn notification-cancel-btn">
            Cancel
          </button>
          <button className="notification-btn notification-confirm-btn">
            Yes, sure
          </button>
        </div>
      </div>
    </div>
  </div>
    
  );
};

export default TelegramNotificationModal;