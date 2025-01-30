import React from 'react';
import { NavLink } from 'react-router-dom';
import '../header/header.css';

const NavigationLinks = ({ onNavClick }) => (
  <div className="nav-items flex gap-[1em] items-center absolute ">
    <NavLink to="/" end className={({ isActive }) => (isActive ? 'active-link font-semibold' : '')} onClick={onNavClick}>
      Home
    </NavLink>
    <div className="nav-divider rounded-lg w-[3px] h-3" />
    <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active-link' : '')} onClick={onNavClick}>
      Dashboard
    </NavLink>
    <div className="nav-divider  rounded-lg w-[3px] h-3" />
    <NavLink to="/form" className={({ isActive }) => (isActive ? 'active-link' : '')} onClick={onNavClick}>
      Form
    </NavLink>
    <div className="nav-divider  rounded-lg w-[3px] h-3" />
    <NavLink to="/vault" className={({ isActive }) => (isActive ? 'active-link' : '')} onClick={onNavClick}>
      Vault
    </NavLink>
    <div className="nav-divider  rounded-lg w-[3px] h-3" />
    <NavLink to="/leaderboard" className={({ isActive }) => (isActive ? 'active-link' : '')} onClick={onNavClick}>
      Leaderboard
    </NavLink>
    {/* <div className="nav-divider"></div> */}
    {/* <NavLink to="/stake" className={({ isActive }) => (isActive ? 'active-link' : '')} onClick={onNavClick}> */}
    {/* Vault */}
    {/* </NavLink> */}
  </div>
);

export default NavigationLinks;