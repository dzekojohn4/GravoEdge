import React from 'react';
import { NavLink } from 'react-router-dom';
import { Github, MessageCircle, Twitter, LayoutDashboard, FormInput } from 'lucide-react';

function Footer() {
  const socialLinks = [
    {
      name: 'Github',
      icon: Github,
      href: 'https://github.com/djeck1432/spotnet',
    },
    {
      name: 'Telegram',
      icon: MessageCircle,
      href: 'https://t.me/djeck_vorobey1',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: 'https://x.com/SpotNet_123',
    },
  ];

  return (
    <footer className="px-20 lg:px-[3em] h-[100px] lg:h-[70px] w-full flex items-center bg-[#050005] relative">
      {/* Desktop Layout */}
      <div className="w-full lg:flex hidden items-center justify-between">
        {/* Copyright */}
        <div className="text-gray-400 text-base">
          <p className="m-0">Copyright©Spotnet2024</p>
        </div>

        {/* Navigation Links */}
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
                  transition-all duration-300 ease-in-out hover:text-[#49abd2] hover:scale-110
                  ${isActive ? 'text-[#49abd2]' : ''}
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

        {/* Social Links */}
        <div className="flex items-center">
          {socialLinks.map(({ name, href, icon: Icon }, index, array) => (
            <React.Fragment key={name}>
              <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label={name}
                className="text-gray-400 hover:text-[#49abd2] transition-all duration-300 hover:scale-110"
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

      {/* Mobile Navigation */}
      <div className="lg:hidden flex relative items-center justify-center w-full p-4 gap-[60px] sm:gap-10">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `
            inline-block text-sm font-normal text-gray-400 
            transition-all duration-300 ease-in-out
            ${isActive ? 'text-[#49abd2] font-semibold' : 'hover:text-[#49abd2]'}
          `}
        >
          <div className="flex flex-col items-center">
            <LayoutDashboard className="mb-[3px] w-5 h-5" />
            <span className="w-20 text-center">Dashboard</span>
          </div>
        </NavLink>
        
        <div className="relative transform-gpu shadow-[0_0_3px_rgba(0,0,0,0.1)] z-[1] 
          rounded-lg w-[1px] h-4 bg-gray-600 opacity-40 flex-shrink-0 m-0" />
        
        <NavLink
          to="/form"
          className={({ isActive }) => `
            inline-block text-sm font-normal text-gray-400 
            transition-all duration-300 ease-in-out
            ${isActive ? 'text-[#49abd2] font-semibold' : 'hover:text-[#49abd2]'}
          `}
        >
          <div className="flex flex-col items-center">
            <FormInput className="mb-[3px] w-5 h-5" />
            <span className="w-20 text-center">Form</span>
          </div>
        </NavLink>

        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r 
          from-[#49abd2] to-[#050005] transition-colors duration-300" />
      </div>
    </footer>
  );
}

export default Footer;