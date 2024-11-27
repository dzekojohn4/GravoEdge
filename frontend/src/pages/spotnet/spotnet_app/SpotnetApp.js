import React from 'react';
import About from '../about/About';
import Partnership from '../partnership/Partnership';
import Information from '../information/Information';
import DontMiss from '../dont_miss/DontMiss';
import Home from '../home/Home';
import useWalletStore from 'stores/useWalletStore';

const SpotnetApp = ({ onConnectWallet, onLogout }) => {
      const { walletId } = useWalletStore();

  return (
    <div className="spotnet-app">
      <Home walletId={walletId} onConnectWallet={onConnectWallet} onLogout={onLogout} />
      <About />
      <Partnership />
      <Information />
      <DontMiss walletId={walletId} onConnectWallet={onConnectWallet} onLogout={onLogout} />
    </div>
  );
};

export default SpotnetApp;
