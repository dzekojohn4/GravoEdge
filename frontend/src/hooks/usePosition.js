import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from 'utils/axios';

const fetchPositionHistoryTable = async (walletId) => {
    if (!walletId) {
        throw new Error('Wallet ID is undefined');
    }
    const response = await axiosInstance.get(`/api/user-positions/${walletId}`);
    return response.data;
};

const usePositionHistoryTable = (walletId) => {
    return useQuery({
        queryKey: ['positionHistory', walletId],
        queryFn: () => fetchPositionHistoryTable(walletId),
        enabled: !!walletId,
        onError: (error) => {
            console.error('Error during fetching position history:', error);
        },
    });
};

export { fetchPositionHistoryTable, usePositionHistoryTable };
