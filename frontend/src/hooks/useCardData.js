import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://0.0.0.0:8000';

const fetchCardData = async (walletId) => {
  if (!walletId) {
    throw new Error('Wallet ID is required');
  }
  const response = await axios.get(`${backendUrl}/api/dashboard?wallet_id=${walletId}`);
  return response.data;
};

export const useCardData = (walletId) => {
  return useQuery(['cardData', walletId], () => fetchCardData(walletId), {
    enabled: !!walletId,
  });
};
