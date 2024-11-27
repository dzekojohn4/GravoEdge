import { create } from 'zustand';

const useWalletStore = create((set) => ({
  walletId: localStorage.getItem('wallet_id'),
  setWalletId: (walletId) => {
    localStorage.setItem('wallet_id', walletId);
    set({ walletId });
  },
}));

export default useWalletStore;
