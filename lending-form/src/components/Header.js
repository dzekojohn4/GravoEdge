import React from 'react';
import { Link } from 'react-router-dom';

function Header({ walletId, onConnectWallet, onLogout }) {
  return (
    <header className="container-fluid py-3" style={{ backgroundColor: '#1A202C' }}>
      <div className="container d-flex justify-content-between align-items-center">
        <div>
          <Link to="/">
            <img src="/images/logo.png" alt="Spotnet Logo" style={{ maxHeight: '50px' }} />
          </Link>
        </div>
        <div>
          {walletId ? (
            <>
              <span className="btn btn-success" style={{ borderRadius: '8px' }}>
                {walletId}
              </span>
              <button className="btn btn-danger ms-3" onClick={onLogout}>Log Out</button>
            </>
          ) : (
            <button className="wallet-btn btn btn-primary" onClick={onConnectWallet}>Connect Wallet</button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;