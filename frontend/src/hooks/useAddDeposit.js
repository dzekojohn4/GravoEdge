import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from 'utils/axios';
import { notify } from 'components/layout/notifier/Notifier';

export const useAddDeposit = () => {
  const mutation = useMutation({
    mutationFn: async ({ positionId, amount, tokenSymbol }) => {
      if (!positionId) {
        return notify('No position found', 'error');
      }           
      
      // Send transaction hash to backend
      const { data } = await axiosInstance.post(`/api/add-extra-deposit/${positionId}`, {
        amount: amount,                 
        token_symbol: tokenSymbol,
        // transaction_hash: transaction_hash
      });

      return data;
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
