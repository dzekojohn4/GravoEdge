import React from 'react';
import { NavLink } from 'react-router-dom';
import TwitterIcon from '@/assets/icons/new-twitter.svg?react';
import TelegramIcon from '@/assets/icons/telegram.svg?react';
import GithubIcon from '@/assets/icons/github.svg?react';
import DashboardIcon from '@/assets/icons/dashboard-icon.svg?react';
import FormIcon from '@/assets/icons/form-icon.svg?react';

function Footer() {
  const socialLinks = [
    {
      name: 'Github',
      icon: GithubIcon,
      href: 'https://github.com/djeck1432/spotnet',
    },
    {
      name: 'Telegram',
      icon: TelegramIcon,
      href: 'https://t.me/djeck_vorobey1',
    },
    {
      name: 'Twitter',
      icon: TwitterIcon,
      href: 'https://x.com/SpotNet_123',
    },
  ];

  return (
    <footer className="px-20 lg:px-[3em] h-[100px] lg:h-[70px] w-full flex items-center bg-[var(--darkish)] relative">
      <div className="w-full lg:flex hidden items-center justify-between">
        <div className="text-gray-400 text-base">
          <p className="m-0">Copyright©Spotnet2024</p>
        </div>
        <nav className="flex items-center">
          {[
            { path: '/documentation', label: 'Documentation' },
            { path: '/overview', label: 'Overview' },
            { path: '/terms-and-conditions', label: 'Terms & Conditions' },
            { path: '/defispring', label: 'Defi Spring Rewards' }
          ].map((link, index, array) => (
            <React.Fragment key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) => `
                  inline-block text-base text-gray-400
                  transition-all duration-300 ease-in-out hover:text-[var(--brand)] hover:scale-110
                  ${isActive ? 'text-[var(--brand)]' : ''}
                `}
                onClick={(e) => {
                  if (window.location.pathname === link.path) {
                    e.preventDefault();
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                {link.label}
              </NavLink>
              {index < array.length - 1 && (
                <div className="mx-4 w-[1px] h-4 bg-gray-600 opacity-40 rounded-full" />
              )}
            </React.Fragment>
          ))}
        </nav>
        <div className="flex items-center">
          {socialLinks.map(({ name, href, icon: Icon }, index, array) => (
            <React.Fragment key={name}>
              <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label={name}
                className="text-gray-400 hover:text-[var(--nav-button-hover)] transition-all duration-300 hover:scale-110"
              >
                <Icon className="w-5 h-5" />
              </a>
              {index < array.length - 1 && (
                <div className="mx-4 w-[1px] h-4 bg-gray-600 opacity-40 rounded-full" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="lg:hidden flex relative items-center justify-center w-full p-4 gap-[60px] sm:gap-10">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `
            inline-block text-sm font-normal text-gray-400 
            transition-all duration-300 ease-in-out
            ${isActive ? 'text-[var(--brand)] font-semibold' : 'hover:text-[var(--brand)]'}
          `}
        >
          <div className="flex flex-col items-center">
            <DashboardIcon className="mb-[3px] w-5 h-5" />
            <span className="w-20 text-center">Dashboard</span>
          </div>
        </NavLink>
        
        <div className="relative transform-gpu z-[1] 
          rounded-lg w-[1px] h-4 bg-gray-600 opacity-40 flex-shrink-0 m-0" />
        
        <NavLink
          to="/form"
          className={({ isActive }) => `
            inline-block text-sm font-normal text-gray-400 
            transition-all duration-300 ease-in-out
            ${isActive ? 'text-[var(--brand)] font-semibold' : 'hover:text-[var(--brand)]'}
          `}
        >
          <div className="flex flex-col items-center">
            <FormIcon className="mb-[3px] w-5 h-5 " />
            <span className="w-20 text-center">Form</span>
          </div>
        </NavLink>

        <div className="absolute top-0 left-0 w-full h-[1px] transition-colors duration-300" />
      </div>
    </footer>
  );
}

export default Footer;