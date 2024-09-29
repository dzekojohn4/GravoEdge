import React from 'react';
import { Link } from 'react-router-dom';

function Header({ walletId, onConnectWallet, onLogout }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-black text-white">
      <div className="flex items-center gap-4">
        <Link to="/">
          <img
            src="/images/Logo.svg"
            alt="Spotnet Logo"
            className="h-8"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </Link>
        <span className="text-2xl font-bold tracking-wider">Spotnet</span>
      </div>
      <div>
        {walletId ? (
          <div className="flex items-center gap-4">
            <div className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#74D6FD] to-[#E01DEE] text-black font-medium">
              {`${walletId.slice(0, 4)}...${walletId.slice(-4)}`}
            </div>
            <button
              className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium"
              onClick={onLogout}
            >
              Log Out
            </button>
          </div>
        ) : (
          <button
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#74D6FD] to-[#E01DEE] text-white font-semibold flex items-center gap-2"
            onClick={onConnectWallet}
          >
            <span>Connect Wallet</span>
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;