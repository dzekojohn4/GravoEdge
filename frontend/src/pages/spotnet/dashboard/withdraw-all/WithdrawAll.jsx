import BalanceCards from '@/components/ui/balance-cards/BalanceCards';
import { Button } from '@/components/ui/custom-button/Button';
import useWithdrawAll from '@/hooks/useWithdrawAll';
import { useWalletStore } from '@/stores/useWalletStore';
import DashboardLayout from '@/pages/DashboardLayout.jsx';

const WithdrawAll = () => {
  const { walletId } = useWalletStore();
  const { withdrawAll, isLoading } = useWithdrawAll();

  const handleWithdrawAll = () => {
    withdrawAll(walletId);
  };

  return (
    <DashboardLayout title="Withdraw All">
      <div className="flex flex-col items-center w-full px-4 sm:px-6 lg:px-8">
        <div className="w-full overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none]">
          <BalanceCards className="balance-card-withdraw whitespace-nowrap !w-full" />
        </div>
        <div className='flex flex-col gap-20 md:gap-10'>
          
        <div className="text-center mt-8">
          <h1 cleassName="text-lg font-medium text-gray-200 mb-4">Please take special note</h1>
        </div>

        <div className="bg-warning-alt text-secondary border border-warning text-center rounded-lg px-6 py-4 w-full md:max-w-[650px] mt-6 mb-6">
          Clicking on the <strong>Withdraw All</strong> button means you are agreeing to close all positions and get all
          tokens transferred to your wallet.
        </div>

        <Button
          variant="primary"
          className="!w-full py-3 md:max-w-[650px]  text-lg"
          size="lg"
          type="button"
          onClick={handleWithdrawAll}
          disabled={isLoading}
          >
          {isLoading ? 'Processing...' : 'Withdraw All'}
        </Button>
      </div>
          </div>
    </DashboardLayout>
  );
};

export default WithdrawAll;

// overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none]
