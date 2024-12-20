import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "utils/axios";
import { notify } from "components/Notifier/Notifier";

const useWithdrawAll = () => {
    const mutation = useMutation({
        mutationFn: async (walletId) => {
            if (!walletId) throw new Error("Wallet ID is required.");
            await axiosInstance.get(`/api/withdraw-all?wallet_id=${walletId}`);
        },
        onSuccess: () => {
            notify("Withdraw All operation completed successfully!", "success");
        },
        onError: (error) => {
            notify(error?.message || "Failed to complete the Withdraw All operation.", "error");
        },
    });

    return {
        withdrawAll: mutation.mutate
    };
};

export default useWithdrawAll;
