import { create } from "zustand";

interface WalletStore {
  walletId: string | null;
  setWalletId: (walletId: string) => void;
  removeWalletId: () => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  walletId: localStorage.getItem("wallet_id"),
  setWalletId: (walletId: string) => {
    localStorage.setItem("wallet_id", walletId);
    set({ walletId });
  },
  removeWalletId: () => {
    localStorage.removeItem("wallet_id");
    set({ walletId: null });
  },
}));
