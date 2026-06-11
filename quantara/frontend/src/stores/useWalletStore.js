import { create } from 'zustand';

/**
 * Zustand store for wallet connection state.
 *
 * Manages the connected wallet ID with localStorage persistence.
 * Provides setWalletId and removeWalletId actions.
 */
export const useWalletStore = create((set) => ({
  walletId: localStorage.getItem('wallet_id'),
  setWalletId: (walletId) => {
    localStorage.setItem('wallet_id', walletId);
    set({ walletId });
  },
  removeWalletId: () => {
    localStorage.removeItem('wallet_id');
    set({ walletId: undefined });
  },
}));
