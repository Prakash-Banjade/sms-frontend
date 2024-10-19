import { queryKeys } from '@/react-query/queryKeys';
import { useAxios } from '@/services/api';
import { QueryOptions, useQuery } from '@tanstack/react-query';

/**
 * Custom hook to fetch data using React Query.
 * @param {string} queryKey - Unique key for the query.
 * @param {Object} options - Additional options for the useQuery hook.
 * @returns {Object} - Contains data, error, loading status, etc.
 */
export const useFetchData = (queryKey: keyof typeof queryKeys, options: QueryOptions = {}) => {
    const axios = useAxios();

    return useQuery({
        queryKey: [queryKey],
        queryFn: async () => {
            const response = await axios.get(`/${queryKey}`);
            return response.data;
        },
        ...options,
    });
};
