import { useAxios } from '@/services/api';
import { keepPreviousData, useQuery, UseQueryOptions } from '@tanstack/react-query';

/**
 * Custom hook to fetch data using React Query.
 * @param {string} queryKey - Unique key for the query.
 * @param {Object} options - Additional options for the useQuery hook.
 * @returns {Object} - Contains data, error, loading status, etc.
 */

export const useFetchData = <TData>({
    queryKey,
    options,
    id = '',
    queryString = '',
    endpoint,
}: {
    queryKey: string[],
    endpoint: string;
    id?: string,
    queryString?: string,
    options?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>
}) => {
    const axios = useAxios();

    const url = `/${endpoint}${id ? `/${id}` : ''}${queryString ? `?${queryString}` : ''}`;

    return useQuery<TData>({
        queryKey: queryKey,
        queryFn: async () => {
            const response = await axios.get<TData>(url);
            return response.data;
        },
        placeholderData: keepPreviousData,
        ...options,
    });
};
