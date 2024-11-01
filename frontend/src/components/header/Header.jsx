import React, { useState, useEffect } from 'react';
import { ReactComponent as Logo } from 'assets/images/logo.svg';
import { NavLink } from 'react-router-dom';
import TelegramLogin from '../Telegram/TelegramLogin';
import './header.css';

function Header({ walletId, onConnectWallet, onLogout, tgUser, setTgUser }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [window.location.pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const NavigationLinks = () => (
    <div className="nav-items">
      <NavLink 
        to="/" 
        end 
        className={({ isActive }) => (isActive ? 'active-link' : '')}
        onClick={() => setIsMenuOpen(false)}
      >
        Home
      </NavLink>
      <NavLink 
        to="/dashboard" 
        className={({ isActive }) => (isActive ? 'active-link' : '')}
        onClick={() => setIsMenuOpen(false)}
      >
        Dashboard
      </NavLink>
    </div>
  );

  const WalletSection = () => (
    <div className="wallet-section">
      <TelegramLogin user={tgUser} onLogin={setTgUser} />
      {walletId ? (
        <div className="wallet-container">
          <button 
            className="logout-button" 
            onClick={() => {
              onLogout();
              setIsMenuOpen(false);
            }}
          >
            Log out
          </button>
          <div className="wallet-id">{`${walletId.slice(0, 4)}...${walletId.slice(-4)}`}</div>
        </div>
      ) : (
        <button 
          className="gradient-button" 
          onClick={() => {
            onConnectWallet();
            setIsMenuOpen(false);
          }}
        >
          <span>Connect Wallet</span>
        </button>
      )}
    </div>
  );

  return (
    <nav>
      <div className="list-items">
        <div className="logo">
          <NavLink to="/">
            <Logo />
          </NavLink>
        </div>
        
        {/* Desktop Navigation */}
        <NavigationLinks />
        <WalletSection />
        
        {/* Hamburger Menu Button */}
        <button 
          className={`hamburger-menu ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
        
        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <NavigationLinks />
          <WalletSection />
        </div>
      </div>
    </nav>
  );
}

export default Header;