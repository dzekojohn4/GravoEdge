import React from 'react';
import TelegramLogin from './Telegram/TelegramLogin';

const WalletSection = ({ 
  walletId, 
  onConnectWallet, 
  onLogout, 
  tgUser, 
  setTgUser, 
  onAction 
}) => {
  const handleWalletAction = (action) => {
    if (action === 'connect') {
      onConnectWallet();
    } else if (action === 'logout') {
      onLogout();
    }
    // Call onAction callback if provided (for mobile menu handling)
    if (onAction) {
      onAction();
    }
  };

  return (
    <div className="wallet-section">
      <TelegramLogin user={tgUser} onLogin={setTgUser} />
      {walletId ? (
        <div className="wallet-container">
          <button 
            className="logout-button" 
            onClick={() => handleWalletAction('logout')}
          >
            Log out
          </button>
          <div className="wallet-id">{`${walletId.slice(0, 4)}...${walletId.slice(-4)}`}</div>
        </div>
      ) : (
        <button 
          className="gradient-button" 
          onClick={() => handleWalletAction('connect')}
        >
          <span>Connect Wallet</span>
        </button>
      )}
    </div>
  );
};

export default WalletSection;