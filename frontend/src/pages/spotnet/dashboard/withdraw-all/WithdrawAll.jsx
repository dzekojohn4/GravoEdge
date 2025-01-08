import React from 'react';
import BalanceCards from 'components/ui/balance-cards/BalanceCards';
import './withdraw_all.css';
import { useWalletStore } from 'stores/useWalletStore';
import { Button } from 'components/ui/custom-button/Button';
import useWithdrawAll from 'hooks/useWithdrawAll';
import Sidebar from 'components/layout/sidebar/Sidebar';
import clockIcon from 'assets/icons/clock.svg';
import computerIcon from 'assets/icons/computer-icon.svg';
import depositIcon from 'assets/icons/deposit.svg';
import withdrawIcon from 'assets/icons/withdraw.svg';

const WithdrawAll = () => {
  const { walletId } = useWalletStore();

  const { withdrawAll, isLoading } = useWithdrawAll();

  const handleWithdrawAll = () => {
    withdrawAll(walletId);
  };

  const dashboardItems = [
    { id: 'dashboard', name: 'Dashboard', link: '/dashboard', icon: computerIcon },
    { id: 'position_history', name: 'Position History', link: '/dashboard/position-history', icon: clockIcon },
    { id: 'deposit', name: 'Add Deposit', link: '/dashboard/deposit', icon: depositIcon },
    { id: 'withdraw', name: 'Withdraw All', link: '/dashboard/withdraw', icon: withdrawIcon },
  ];

  return (
    <div className="withdraw">
      <Sidebar items={dashboardItems} />
      <div className="withdrawall-wrapper">
        <div className="withdrawall-container">
          <BalanceCards />
          <div className="withdrawall-content">
            <div className="withdrawall-title">
              <h1>Please take special note</h1>
            </div>

            <div className="withdrawall-info-card">
              Clicking on the `Withdraw All` button means you are agreeing to close all positions and get all tokens
              transferred to your wallet.
            </div>
            <Button variant="primary" size="lg" type="button" onClick={handleWithdrawAll} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Withdraw All'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawAll;
