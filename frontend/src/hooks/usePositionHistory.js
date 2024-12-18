import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from 'utils/axios';
import { useWalletStore } from 'stores/useWalletStore';

const fetchPositionHistoryTable = async (walletId) => {
    if (!walletId) {
        throw new Error('Wallet ID is undefined');
    }
    const response = await axiosInstance.get(`/api/user-positions/${walletId}`);
    return response.data;
};

const usePositionHistoryTable = () => {
    const walletId = useWalletStore((state) => state.walletId);

    const { data, isLoading, error } = useQuery({
        queryKey: ['positionHistory', walletId],
        queryFn: () => fetchPositionHistoryTable(walletId),
        enabled: !!walletId,
        onError: (err) => {
            console.error('Error during fetching position history:', err);
        },
    });

    return {
        data,
        isLoading,
        error: walletId ? error : 'Wallet ID is required',
    };
};

export { usePositionHistoryTable };
