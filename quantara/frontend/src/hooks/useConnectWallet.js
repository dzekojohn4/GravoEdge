import { useMutation } from '@tanstack/react-query';
import { notify } from '../components/layout/notifier/Notifier';
import { connectWallet } from '../services/wallet';

/**
 * Hook for connecting to the Freighter Stellar wallet.
 *
 * @param {Function} setWalletId - Zustand store setter for wallet ID
 * @returns {useMutation} React Query mutation for wallet connection
 */
export const useConnectWallet = (setWalletId) => {
  return useMutation({
    mutationFn: async () => {
      const publicKey = await connectWallet();

      if (!publicKey) {
        throw new Error('Failed to connect wallet');
      }

      return publicKey;
    },
    onSuccess: (publicKey) => {
      localStorage.setItem('gravoedge_last_connected_wallet', publicKey);
      setWalletId(publicKey);
    },
    onError: (error) => {
      console.error('Wallet connection failed:', error);
      notify(error.message || 'Failed to connect wallet. Please try again.', 'error');
    },
  });
};
