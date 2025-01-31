import React, { useEffect, useState } from 'react';
import { useMatchMedia } from '@/hooks/useMatchMedia';
import { getBalances } from '@/services/wallet';
import { useWalletStore } from '@/stores/useWalletStore';

import ETH from '@/assets/icons/ethereum.svg?react';
import USDC from '@/assets/icons/borrow_usdc.svg?react';
import STRK from '@/assets/icons/strk.svg?react';

const BalanceCards = ({ className }) => {
  const { walletId } = useWalletStore();

  const isMobile = useMatchMedia('(max-width: 768px)');

  useEffect(() => {
    getBalances(walletId, setBalances);
  }, [walletId]);

  const [balances, setBalances] = useState([
    { icon: <ETH />, title: 'ETH', balance: '0.00' },
    { icon: <USDC />, title: 'USDC', balance: '0.00' },
    { icon: <STRK />, title: 'STRK', balance: '0.00' },
  ]);

  return (
    <div className="mt-3 mx-auto max-w-2xl px-3 w-full">
      <div className="grid grid-cols-3 w-full rounded-[8px] gap-2.5 sm:gap-5">
        {balances.map((balance) =>
          isMobile ? (
            <div
              className="border flex flex-col items-center text-center border-[#36294E] py-3 px-2.5 rounded-[8px] max-w-[180px]"
              key={balance.title}
            >
              <label htmlFor={balance.title} className={'flex text-[#83919F] gap-1'}>
                <span className="token-icon blend">{balance.icon}</span>
                <span className="balance-text">{balance.title} Balance</span>
              </label>
              <label htmlFor={balance.title}>
                <span className="text-white">{balance.balance}</span>
              </label>
            </div>
          ) : (
            <div
              className="border flex flex-col items-center text-center border-[#36294E] py-3 px-6 rounded-[8px]"
              key={balance.title}
            >
              <label htmlFor={balance.title} className={'flex text-[#83919F] gap-1'}>
                <span className="token-icon blend">{balance.icon}</span>
                <span className="balance-text">{balance.title} Balance</span>
              </label>
              <label htmlFor={balance.title}>
                <span className="font-semibold text-2xl text-white">{balance.balance}</span>
              </label>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default BalanceCards;
