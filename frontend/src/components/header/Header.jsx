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
import React, { useState, useEffect } from 'react';
import { ReactComponent as Logo } from 'assets/images/logo.svg';
import { NavLink } from 'react-router-dom';
import WalletSection from 'components/WalletSection';
import NavigationLinks from 'components/NavigationLinks';
import useLockBodyScroll from 'hooks/useLockBodyScroll';
import './header.css';
import '../../globals.css';

function Header({ walletId, onConnectWallet, onLogout, tgUser, setTgUser }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Use the custom hook for body scroll locking
  useLockBodyScroll(isMenuOpen);
  0;

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [window.location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav>
      <div className="list-items">
        <div className="logo">
          <NavLink to="/">
            <Logo className="logo-icon" />
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <NavigationLinks onNavClick={handleNavClick} />
        <WalletSection
          walletId={walletId}
          onConnectWallet={onConnectWallet}
          onLogout={onLogout}
          tgUser={tgUser}
          setTgUser={setTgUser}
        />

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
          <NavigationLinks onNavClick={handleNavClick} />
          <WalletSection
            walletId={walletId}
            onConnectWallet={onConnectWallet}
            onLogout={onLogout}
            tgUser={tgUser}
            setTgUser={setTgUser}
            onAction={() => setIsMenuOpen(false)}
          />
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
