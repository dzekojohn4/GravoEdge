import React, { useEffect } from 'react';
import { useMatchMedia } from 'hooks/useMatchMedia';
import { getBalances } from '../../services/wallet';
import { useWalletStore } from 'stores/useWalletStore';
import "./balanceCards.css";

const BalanceCards = ({ balances, setBalances }) => {
  const { walletId } = useWalletStore();

  const isMobile = useMatchMedia('(max-width: 768px)');

  useEffect(() => {
    getBalances(walletId, setBalances);
  }, [walletId]);

  return (
    <div className="balance-card">
      <div className="balance-container">
        {balances.map((balance) =>
          isMobile ? (
            <div className="balance-item" key={balance.title}>
              <div className="title-container">
                <label htmlFor="icon" className="balance-title">
                  <span className="token-icon">{balance.icon}</span>
                </label>
                <label htmlFor={balance.title}>{balance.title} Balance</label>
              </div>
              <label htmlFor={balance.title}>{balance.balance}</label>
            </div>
          ) : (
            <div className="balance-item" key={balance.title}>
              <label htmlFor={balance.title} className={'balance-title'}>
                <span className="token-icon blend">{balance.icon}</span>
                {balance.title} Balance
              </label>
              <label htmlFor={balance.title}>{balance.balance}</label>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default BalanceCards;
