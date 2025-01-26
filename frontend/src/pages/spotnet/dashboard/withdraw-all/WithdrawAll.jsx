import React from 'react';
import BalanceCards from '../../../../components/ui/balance-cards/BalanceCards';
import './withdraw_all.css';
import { useWalletStore } from '../../../../stores/useWalletStore';
import { Button } from '../../../../components/ui/custom-button/Button';
import useWithdrawAll from '../../../../hooks/useWithdrawAll';
import Sidebar from '../../../../components/layout/sidebar/Sidebar';
import clockIcon from '../../../../assets/icons/clock.svg';
import computerIcon from '../../../../assets/icons/computer-icon.svg';
import depositIcon from '../../../../assets/icons/deposit.svg';
import withdrawIcon from '../../../../assets/icons/withdraw.svg';
import DashboardLayout from '../../../DashboardLayout';
import BalanceCards from 'components/ui/balance-cards/BalanceCards';
import { useWalletStore } from 'stores/useWalletStore';
import { Button } from 'components/ui/custom-button/Button';
import useWithdrawAll from 'hooks/useWithdrawAll';
import './withdraw_all.css';

const WithdrawAll = () => {
  const { walletId } = useWalletStore();
  const { withdrawAll, isLoading } = useWithdrawAll();

  const handleWithdrawAll = () => {
    withdrawAll(walletId);
  };

  return (
    <DashboardLayout title="Withdraw All">
      <BalanceCards className="balance-card-withdraw" />
      <div className="withdrawall-content">
        <div className="withdrawall-title">
          <h1>Please take special note</h1>
        </div>

        <div className="withdrawall-info-card">
          Clicking on the `Withdraw All` button means you are agreeing to close all positions and get all tokens
          transferred to your wallet.
        </div>
        <Button
          variant="primary"
          className="withdraw-all-btn"
          size="lg"
          type="button"
          onClick={handleWithdrawAll}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Withdraw All'}
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default WithdrawAll;
