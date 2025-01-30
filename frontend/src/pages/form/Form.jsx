import React, { useState } from 'react';
import TokenSelector from '@/components/ui/token-selector/TokenSelector';
import BalanceCards from '@/components/ui/balance-cards/BalanceCards';
import MultiplierSelector from '@/components/ui/multiplier-selector/MultiplierSelector';
import { handleTransaction } from '@/services/transaction';
import Spinner from '@/components/ui/spinner/Spinner';
import { Button } from '@/components/ui/custom-button/Button';
import { useWalletStore } from '@/stores/useWalletStore';
import { useConnectWallet } from '@/hooks/useConnectWallet';
import { useCheckPosition } from '@/hooks/useClosePosition';
import { useNavigate } from 'react-router-dom';
import { ActionModal } from '@/components/ui/action-modal';
import { useHealthFactor } from '@/hooks/useHealthRatio';
import { notify } from '@/components/layout/notifier/Notifier';

const Form = () => {
  const navigate = useNavigate();
  const { walletId, setWalletId } = useWalletStore();
  const [tokenAmount, setTokenAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('ETH');
  const [selectedMultiplier, setSelectedMultiplier] = useState('');
  const [loading, setLoading] = useState(false);

  const [isClosePositionOpen, setClosePositionOpen] = useState(false);
  const connectWalletMutation = useConnectWallet(setWalletId);
  const { data: positionData, refetch: refetchPosition } = useCheckPosition();

  const { healthFactor, isLoading: isHealthFactorLoading } = useHealthFactor(
    selectedToken,
    tokenAmount,
    selectedMultiplier
  );

  const connectWalletHandler = () => {
    if (!walletId) {
      connectWalletMutation.mutate();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let connectedWalletId = walletId;
    if (!connectedWalletId) {
      connectWalletHandler();
      return;
    }

    await refetchPosition();
    if (positionData?.has_opened_position) {
      setClosePositionOpen(true);
      return;
    }

    if (tokenAmount === '' || selectedToken === '' || selectedMultiplier === '') {
      notify('Please fill the form', 'error');
      return;
    }

    const formData = {
      wallet_id: connectedWalletId,
      token_symbol: selectedToken,
      amount: tokenAmount,
      multiplier: selectedMultiplier,
    };
    await handleTransaction(connectedWalletId, formData, setTokenAmount, setLoading);
  };

  const handleCloseModal = () => {
    setClosePositionOpen(false);
  };

  const onClosePositionAction = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col gap-[30px] items-center py-4 max-[768px]:gap-0">
      <BalanceCards className="balance-card" />

      {isClosePositionOpen && (
        <ActionModal
          isOpen={isClosePositionOpen}
          title="Open New Position"
          subTitle="Do you want to open new a position?"
          content={[
            'You have already opened a position.',
            'Please close active position to open a new one.',
            "Click the 'Close Active Position' button to continue.",
          ]}
          cancelLabel="Cancel"
          submitLabel="Close Active Position"
          submitAction={onClosePositionAction}
          cancelAction={handleCloseModal}
        />
      )}
      <form
        className="flex justify-center flex-col gap-[10px] pb-[10px]  w-[626px] max-[768px]:mx-0 max-[768px]:w-full max-[768px]:p-4 text-[#fff]"
        onSubmit={handleSubmit}
      >
        <div className=" font-normal text-[14px] mb-[20px] max-[768px]:mb-5">
          <h5>Please submit your leverage details</h5>
        </div>
        <TokenSelector
          selectedToken={selectedToken}
          setSelectedToken={setSelectedToken}
          className="form-token-selector"
        />
        <div className="text-[#83919f] text-4 w-full pt-2">
          <label>Select Multiplier</label>
        </div>
        <div className="w-full">
          <MultiplierSelector
            setSelectedMultiplier={setSelectedMultiplier}
            selectedToken={selectedToken}
            sliderValue={selectedMultiplier}
          />
        </div>
        <div className="flex flex-col gap-[5px] mt-[60px] w-full mb-2">
          <label className="text-start w-full text-[#83919F] pt-5">Token Amount</label>
          <input
            className="max-[768px]:rounded-[12px] max-[768px]:text-[14px] bg-transparent rounded-[8px] py-4 px-[30px] border-[#36294e] border w-full"
            type="number"
            placeholder="Enter Token Amount"
            value={tokenAmount}
            onChange={(e) => setTokenAmount(e.target.value)}
          />
        </div>
        <div className="">
          <div className="flex flex-row items-end justify-self-end w-fit m-0.5 text-gray-400 gap-[5px] self-end">
            <p>Estimated Health Factor Level:</p>
            <p>{isHealthFactorLoading ? 'Loading...' : healthFactor}</p>
          </div>
          <Button variant="secondary" size="lg" type="submit" className="form-button">
            Submit
          </Button>
        </div>
      </form>
      <Spinner loading={loading} />
    </div>
  );
};

export default Form;
