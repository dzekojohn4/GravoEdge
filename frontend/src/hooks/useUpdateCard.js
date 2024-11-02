import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Хук для мутации данных
export const useUpdateData = (endpoint) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (newData) => {
      const { data } = await axios.put(endpoint, newData);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['data', endpoint]); // Обновляем кэш данных
      },
    }
  );
};
