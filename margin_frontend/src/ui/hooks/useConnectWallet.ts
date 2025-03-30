import { useMutation } from "@tanstack/react-query";
import { notify } from "../layout/notifier";
import { connectWallet } from "../../services/wallet";

export const useConnectWallet = (setWalletId: (walletId: string) => void) => {
  return useMutation({
    mutationFn: async () => {
      const wallet = await connectWallet();
      const walletAddress = wallet.selectedAddress;

      if (!walletAddress) {
        throw new Error("Failed to connect wallet");
      }
      return walletAddress;
    },
    onSuccess: (walletAddress) => {
      setWalletId(walletAddress);
    },
    onError: (error) => {
      console.error("Wallet connection failed:", error);
      notify("Failed to connect wallet. Please try again.", "error");
    },
  });
};
