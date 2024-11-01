import React, { useEffect, useState } from 'react';
import { ReactComponent as ETH } from '../assets/icons/ethereum.svg';
import { ReactComponent as USDC } from '../assets/icons/borrow_usdc.svg';
import { ReactComponent as STRK } from '../assets/icons/strk.svg';
import { ReactComponent as DAI } from '../assets/icons/dai.svg';
import { getBalances } from '../utils/wallet';

const BalanceCards = ({ walletId }) => {
  const [balances, setBalances] = useState([
    { icon: <ETH />, title: 'ETH', balance: '0.00' },
    { icon: <USDC />, title: 'USDC', balance: '0.00' },
    { icon: <STRK />, title: 'STRK', balance: '0.00' },
    { icon: <DAI />, title: 'DAI', balance: '0.00' },
  ]);

  const [isMobile, setIsMobile] = useState(window.matchMedia('(max-width: 768px)').matches);
  useEffect(() => {
    getBalances(walletId, setBalances);
  }, [walletId]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    const handleMediaQueryChange = (e) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);
  return (
    <div className="balance-container">
      {balances.map((balance) =>
        isMobile ? (
          <div className="balance-item" key={balance.title}>
            <label htmlFor="icon" className="balance-title">
              {balance.icon}
            </label>
            <div className="title-container">
              <label htmlFor={balance.title}>{balance.title} Balance:</label>
              <label htmlFor={balance.title}>{balance.balance}</label>
            </div>
          </div>
        ) : (
          <div className="balance-item" key={balance.title}>
            <label htmlFor={balance.title} className={'balance-title'}>
              {balance.icon}
              {balance.title} Balance:
            </label>
            <label htmlFor={balance.title}>{balance.balance}</label>
          </div>
        )
      )}
    </div>
  );
};

export default BalanceCards;
