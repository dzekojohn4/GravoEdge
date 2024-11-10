import React, { useState, useEffect } from 'react';
import { ReactComponent as Logo } from 'assets/images/logo.svg';
import { NavLink } from 'react-router-dom';
import WalletSection from 'components/WalletSection';
import NavigationLinks from 'components/NavigationLinks';
import useLockBodyScroll from 'hooks/useLockBodyScroll';
import { useLocation } from 'react-router-dom';
import './header.css';
import '../../globals.css';

function Header({ walletId, onConnectWallet, onLogout, tgUser, setTgUser }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation(); // getting object location

  // Use the custom hook for body scroll locking
  useLockBodyScroll(isMenuOpen);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Close the menu when the window size is changed
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMenuOpen(false);
      }
    };
    // Add resize event handler
    window.addEventListener('resize', handleResize);

    // Remove the handler when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Pass an empty array of dependencies so that this effect will only be triggered once when mounting.

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav>
      <div className="list-items">
        <div className="logo">
          <NavLink to="/">
            <Logo />
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
      </div>
      {/* Hamburger Menu Button */}
      <button className={`hamburger-menu ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu} aria-label="Toggle menu">
        <span className="hamburger-line" />
        <span className="hamburger-line" />
        <span className="hamburger-line" />
      </button>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="flex-container">
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
