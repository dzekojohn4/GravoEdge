import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Logo from '@/assets/icons/spotnet-logo.svg';
import WalletSection from '@/components/layout/wallet-section/WalletSection';
import NavigationLinks from '@/components/layout/navigation-links/NavigationLinks';
import useLockBodyScroll from '@/hooks/useLockBodyScroll';
import MobDropdownMenu from '@/components/layout/mob-dropdown-menu/MobDropdownMenu';
import './header.css';
import { ReportBugButton } from '@/components/report-button/ReportBugButton';
import { ReportBugModal } from '@/components/report-modal/ReportBugModal';

const STICKY_ROUTES = [
  '/overview',
  '/documentation',
  '/dashboard',
  '/dashboard/position-history',
  '/dashboard/deposit',
  '/stake',
  '/dashboard/withdraw',
  '/terms-and-conditions',
  '/defispring',
];

const useMenuHandling = (pathname) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMenuOpen,
    toggleMenu: () => setIsMenuOpen(!isMenuOpen),
    closeMenu: () => setIsMenuOpen(false)
  };
};

const useModalHandling = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return {
    isModalOpen,
    openModal: () => setIsModalOpen(true),
    closeModal: () => setIsModalOpen(false)
  };
};

const Navigation = ({ makeNavStick, children }) => (
  <nav className={
    makeNavStick 
      ? ' z-[100] fixed flex items-center w-full justify-center h-[90px] whitespace-nowrap border-b border-[var(--deep-purple)] bg-header-bg' 
      : ' relative z-[9999] flex items-center w-full justify-center h-[90px] whitespace-nowrap border-b border-[var(--deep-purple)] bg-header-bg'
  }>
    {children}
  </nav>
);

const LogoSection = () => (
  <div className="lg:pl-[5em]">
    <NavLink to="/">
   <img src={Logo} className='@max-xs:w-[200px] sm:w-[230px] h-auto md:w-[250px] md:h-auto mt-[9px] lg:w-[300px] lg:h-auto'/>
    </NavLink>
  </div>
);

function Header({ onConnectWallet, onLogout }) {
  const location = useLocation();
  const makeNavStick = STICKY_ROUTES.includes(location.pathname);
  
  const { isMenuOpen, toggleMenu, closeMenu } = useMenuHandling(location.pathname);
  const { isModalOpen, openModal, closeModal } = useModalHandling();
  
  useLockBodyScroll(isMenuOpen);

  return (
    <>
      <Navigation makeNavStick={makeNavStick}>
        <div className="flex items-center justify-between bg-transparent w-full  px-[30px] relative">
          <LogoSection />
          
          <NavigationLinks onNavClick={closeMenu} />
          
          <div className=" flex items-center">
            <div className="block lg:hidden relative">
              <MobDropdownMenu 
                isMenuOpen={isMenuOpen} 
                toggleMenu={toggleMenu} 
              />
            </div>
            <WalletSection 
              onConnectWallet={onConnectWallet} 
              onLogout={onLogout} 
            />
          </div>
        </div>
      </Navigation>

      {!isModalOpen && <ReportBugButton onClick={openModal} />}
      {isModalOpen && <ReportBugModal onClose={closeModal} />}
    </>
  );
}

export default Header;