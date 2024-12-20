import React, { useState } from 'react';
import BalanceCards from 'components/BalanceCards/BalanceCards';
import { ReactComponent as ETH } from '../../../../assets/icons/ethereum.svg';
import { ReactComponent as USDC } from '../../../../assets/icons/borrow_usdc.svg';
import { ReactComponent as STRK } from '../../../../assets/icons/strk.svg';
import './withdraw_all.css';
import { useWalletStore } from 'stores/useWalletStore';
import Button from 'components/ui/Button/Button';
import useWithdrawAll from 'hooks/useWithdrawAll';

const WithdrawAll = () => {
  const { walletId } = useWalletStore();
  const [balances, setBalances] = useState([
    { icon: <ETH />, title: 'ETH', balance: '0.00' },
    { icon: <USDC />, title: 'USDC', balance: '0.00' },
    { icon: <STRK />, title: 'STRK', balance: '0.00' },
  ]);

  const { withdrawAll } = useWithdrawAll();
  const handleWithdrawAll = () => {
    withdrawAll(walletId);
  };

  return (
    <div className="withdrawall-wrapper">
      <div className="withdrawall-container">
        <BalanceCards balances={balances} setBalances={setBalances} walletId={walletId} />
        <div className="withdrawall-content">
          
        <div className="withdrawall-title">
          <h1>Please take special note</h1>
        </div>

          <div className="withdrawall-info-card">
            Clicking on the `Withdraw All` button means you are agreeing to close all positions and get all tokens
            transferred to your wallet.
          </div>
          <Button className="withdrawall-btn" variant="secondary" size="lg" type="button" onClick={handleWithdrawAll}>
            Withdraw All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawAll;
