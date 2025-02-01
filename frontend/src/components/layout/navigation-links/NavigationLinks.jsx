import React from 'react';
import { NavLink } from 'react-router-dom';

const NavigationLinks = ({ onNavClick }) => (
  <div className="hidden translate-x-[-50%] capitalize font-medium text-base duration-300 lg:flex gap-[1em] items-center absolute left-[50%]">
    <NavLink 
      to="/" 
      end 
      className={({ isActive }) => 
        isActive ? 'text-[var(--nav-button-hover)] font-semibold' : 
        'hover:text-[var(--nav-button-hover)] duration-300 font-medium relative capitalize font-primary leading-[150%] text-white'
      } 
      onClick={onNavClick}
    >
      Home
    </NavLink>

    <div className="w-[1.5px] rounded-md h-4  bg-[var(--gray)]" />

    <NavLink 
      to="/dashboard" 
      className={({ isActive }) => 
        isActive ? 'text-[var(--nav-button-hover)] font-semibold' : 
        'hover:text-[var(--nav-button-hover)] duration-300 font-medium relative capitalize font-primary leading-[150%] text-white'
      } 
      onClick={onNavClick}
    >
      Dashboard
    </NavLink>

    <div className="w-[1.5px] rounded-md h-4  bg-[var(--gray)]" />

    <NavLink 
      to="/form" 
      className={({ isActive }) => 
        isActive ? 'text-[var(--nav-button-hover)] font-semibold' : 
        'hover:text-[var(--nav-button-hover)] duration-300 font-medium relative capitalize font-primary leading-[150%] text-white'
      } 
      onClick={onNavClick}
    >
      Form
    </NavLink>

    <div className="w-[1.5px] rounded-md h-4  bg-[var(--gray)]" />

    <NavLink 
      to="/vault" 
      className={({ isActive }) => 
        isActive ? 'text-[var(--nav-button-hover)] font-semibold' : 
        'hover:text-[var(--nav-button-hover)] duration-300 font-medium relative capitalize font-primary leading-[150%] text-white'
      } 
      onClick={onNavClick}
    >
      Vault
    </NavLink>

    <div className="w-[1.5px] rounded-md h-4  bg-[var(--gray)]" />

    <NavLink 
      to="/leaderboard" 
      className={({ isActive }) => 
        isActive ? 'text-[var(--nav-button-hover)]' : 
        'hover:text-[var(--nav-button-hover)] duration-300 font-[var(--font-weight-md)] relative capitalize leading-[150%] text-white'
      } 
      onClick={onNavClick}
    >
      Leaderboard
    </NavLink>
  </div>
);

export default NavigationLinks;