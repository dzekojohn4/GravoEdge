import React, { useState } from 'react';
import './header.css';
import { ReactComponent as Logo } from '../../assets/images/logo.svg';
import { Link } from 'react-router-dom';

function Header({ walletId, onConnectWallet, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav>
      <div className='list-items'>
        <div className='logo'>
          <Link to='/'>
            <Logo className='logo-svg' />
          </Link>
        </div>
        <div className={`nav-items ${menuOpen ? 'open' : ''}`}>
          <a href='/'>Home</a>
          <Link to='/dashboard'>Dashboard</Link>
        </div>
        <div className='wallet-section'>
          {walletId ? (
            <div className='wallet-container'>
              <div className='wallet-id'>
                {`${walletId.slice(0, 4)}...${walletId.slice(-4)}`}
              </div>
              <button
                className='gradient-button'
                onClick={onLogout}
              >
                Log Out
              </button>
            </div>
          ) : (
            <button
              className='gradient-button'
              onClick={onConnectWallet}
            >
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
        <div
          className='hamburger'
          onClick={toggleMenu}
        >
          <span className='bar'></span>
          <span className='bar'></span>
          <span className='bar'></span>
        </div>
      </div>
    </nav>
  );
}

export default Header;
