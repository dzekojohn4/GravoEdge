import React, { useEffect, useState } from 'react';
import { ReactComponent as ETH } from '../assets/icons/ethereum.svg';
import { useMatchMedia } from 'hooks/useMatchMedia';
import { getBalances } from '../services/wallet';

const BalanceCards = ({ walletId }) => {
  const [balances, setBalances] = useState([
    { icon: <ETH />, title: 'ETH', balance: '0.00' },
    { icon: <ETH />, title: 'USDC', balance: '0.00' },
    { icon: <ETH />, title: 'STRK', balance: '0.00' },
    { icon: <ETH />, title: 'DAI', balance: '0.00' },
  ]);

  const isMobile = useMatchMedia('(max-width: 768px)');

  useEffect(() => {
    getBalances(walletId, setBalances);
  }, [walletId]);

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
              {balance.title} Balance
            </label>
            <label htmlFor={balance.title}>{balance.balance}</label>
          </div>
        )
      )}
    </div>
  );
};

export default BalanceCards;