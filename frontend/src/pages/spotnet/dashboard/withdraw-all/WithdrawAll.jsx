import React, { useState } from 'react';
import BalanceCards from 'components/BalanceCards';
import { ReactComponent as ETH } from '../../../../assets/icons/ethereum.svg';
import { ReactComponent as USDC } from '../../../../assets/icons/borrow_usdc.svg';
import { ReactComponent as STRK } from '../../../../assets/icons/strk.svg';
import './withdraw_all.css';
import { useWalletStore } from 'stores/useWalletStore';
import Button from 'components/ui/Button/Button';

const WithdrawAll = () => {
  const { walletId } = useWalletStore();
  const [balances, setBalances] = useState([
    { icon: <ETH />, title: 'ETH', balance: '0.00' },
    { icon: <USDC />, title: 'USDC', balance: '0.00' },
    { icon: <STRK />, title: 'STRK', balance: '0.00' },
  ]);

  return (
    <div className="withdrawall-wrapper">
      <div className="withdrawall-container">
        <BalanceCards balances={balances} setBalances={setBalances} walletId={walletId} />
        <div className="withdrawall-info-card">
        Clicking on the `Withdraw All` button means you are agreeing to close all positions and get all tokens transferred to your wallet.
        </div>
        <Button className="withdrawall-btn" variant="secondary" size="lg" type="submit">
          Withdraw All
        </Button>
      </div>
    </div>
  );
};

export default WithdrawAll;