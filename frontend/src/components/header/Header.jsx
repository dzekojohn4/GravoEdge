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
      </div>
    </nav>
  );
}

export default Header;
