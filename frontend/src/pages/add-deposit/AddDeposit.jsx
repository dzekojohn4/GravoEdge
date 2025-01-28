import EthIcon from '@/assets/icons/ethereum.svg?react';
import HealthIcon from '@/assets/icons/health.svg?react';
import Card from '@/components/ui/card/Card';
import { Button } from '@/components/ui/custom-button/Button';
import TokenSelector from '@/components/ui/token-selector/TokenSelector';
import { useAddDeposit } from '@/hooks/useAddDeposit';
import useDashboardData from '@/hooks/useDashboardData';
import { NUMBER_REGEX } from '@/utils/regex';
import { useState } from 'react';
import DashboardLayout from '../DashboardLayout';
import './addDeposit.css';

export const AddDeposit = () => {
  const formatNumber = (value, currency = false) => {
    const number = parseFloat(value);
    if (isNaN(number)) return currency ? '$0.00' : '0';
    return currency ? `$${number.toFixed(2)}` : number.toFixed();
  };

  const [amount, setAmount] = useState('0');
  const [selectedToken, setSelectedToken] = useState('STRK');
  const { data: dashboardData } = useDashboardData();

  const { mutate: addDeposit, isLoading } = useAddDeposit();

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (NUMBER_REGEX.test(value)) {
      setAmount(value);
    }
  };

  const handleDeposit = () => {
    addDeposit(
      {
        positionId: dashboardData.position_id,
        amount,
        tokenSymbol: selectedToken,
      },
      {
        onSuccess: () => {
          setAmount('0');
          setSelectedToken('STRK');
        },
      }
    );
  };

  return (
    <DashboardLayout title="Add Deposit">
      <div className="main-container-deposit">
        <div className="top-cards-dashboard">
          <Card label="Health Factor" value={dashboardData?.health_ratio} icon={<HealthIcon className="icon" />} />
          <Card
            label="Borrow Balance"
            value={formatNumber(dashboardData?.borrowed, true)}
            icon={<EthIcon className="icon" />}
          />
        </div>
      </div>
      <h1 className="deposit-title2">Please make a deposit</h1>
      <TokenSelector
        selectedToken={selectedToken}
        setSelectedToken={setSelectedToken}
        className="deposit-token-selector"
      />
      <div className="amount-input-deposit" aria-labelledby="amount-input-label">
        <input
          type="text"
          id="amount-field"
          value={amount}
          onChange={handleAmountChange}
          pattern="^\d*\.?\d*$"
          className="amount-field-deposit"
          aria-describedby="currency-symbol"
          placeholder="0.00"
          disabled={isLoading}
        />
        <span id="currency-symbol" className="currency-deposit">
          {selectedToken}
        </span>
      </div>

      <Button
        size="lg"
        className="redeem-btn"
        variant="primary"
        onClick={handleDeposit}
        disabled={isLoading || amount === '0'}
      >
        {isLoading ? 'Processing...' : 'Deposit'}
      </Button>
    </DashboardLayout>
  );
};
