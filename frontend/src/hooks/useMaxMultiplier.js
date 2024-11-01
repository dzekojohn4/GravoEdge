import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://0.0.0.0:8000';

export const useMaxMultiplier = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['max-multiplier'],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}/api/get-multipliers`);
      return response.data.multipliers;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    refetchInterval: 60 * 60 * 1000, // 1 hour
  });

  return { data, isLoading, error };
};

