import { QueryKey } from '@/react-query/queryKeys';
import { useAxios } from '@/services/api';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

interface MutationParams<TData> {
    key: QueryKey;
    id?: string;
    method: 'post' | 'patch' | 'delete';
    data?: TData;
    config?: AxiosRequestConfig;
    toastOnError?: boolean;
}

export const useAppMutation = <TData, TResponse>(): UseMutationResult<
    AxiosResponse<TResponse>,
    unknown,
    MutationParams<TData>
> => {
    const axios = useAxios();

    return useMutation({
        mutationFn: async ({ key, method, data, config, id = '' }) => {
            try {
                const response = axios[method](`/${key}${id ? `/${id}` : ''}`, data, config);
                return response;
            } catch (error) {
                throw error;
            }
        },
        onError(error, variables) {
            if (error instanceof Error) {
                variables.toastOnError && toast.error(error.message);
            } else if (error instanceof AxiosError) {
                variables.toastOnError && toast.error(`${error.message}`);
            }
            console.log(error)
        },
    })
};