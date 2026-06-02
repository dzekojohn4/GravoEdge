import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../utils/axios';
import { notify } from '../components/layout/notifier/Notifier';
import { getWalletPublicKey } from '../services/wallet';
import { sendExtraDepositTransaction } from '../services/transaction';

export const useAddDeposit = () => {
  const mutation = useMutation({
    mutationFn: async ({ positionId, amount, tokenSymbol }) => {
      if (!positionId || positionId === '0') {
        return notify('No position found', 'error');
      }
      // Get wallet public key (Stellar)
      const walletId = await getWalletPublicKey();
      if (!walletId) {
        return notify('Please connect wallet first', 'error');
      }
      const { data: contractAddress } = await axiosInstance.get(`/api/get-user-contract?wallet_id=${walletId}`);

      // Prepare extra deposit data
      const { data: prepare_data } = await axiosInstance.get(`/api/get-add-deposit-data/${positionId}`, {
        params: {
          amount: amount,
          token_symbol: tokenSymbol,
        },
      });

      // Send transaction via Soroban contract
      const { transaction_hash } = await sendExtraDepositTransaction(prepare_data.deposit_data, contractAddress);

      // Send transaction hash to backend
      return await axiosInstance.post(`/api/add-extra-deposit/${positionId}`, {
        transaction_hash: transaction_hash,
        token_symbol: tokenSymbol,
        amount: amount,
      });
    },
    onSuccess: () => {
      notify('Successfully deposited!', 'success');
    },
    onError: (error) => {
      notify(error.response?.data?.message || 'Failed to process deposit', 'error');
    },
  });

  return mutation;
};
