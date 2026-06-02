import React from 'react';
import About from '@/components/home/about/About';
import Partnership from '@/components/home/partnership/Partnership';
import Information from '@/components/home/information/Information';
import DontMiss from '@/components/home/dont-miss/DontMiss';
import Home from '@/components/home/home/Home';

const QuantaraApp = ({ onConnectWallet, onLogout }) => {
  return (
    <div className="quantara-app">
      <Home onConnectWallet={onConnectWallet} onLogout={onLogout} />
      <About />
      <Partnership />
      <Information />
      <DontMiss onConnectWallet={onConnectWallet} onLogout={onLogout} />
    </div>
  );
};

export default QuantaraApp;
