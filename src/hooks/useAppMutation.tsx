import { useAxios } from '@/services/api';
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

interface MutationParams<TData> {
    endpoint: string;
    invalidateTags?: string[];
    id?: string;
    method: 'post' | 'patch' | 'delete';
    data?: TData;
    config?: AxiosRequestConfig;
    toastOnError?: boolean;
    toastOnSuccess?: boolean;
}

export const useAppMutation = <TData, TResponse>(): UseMutationResult<
    AxiosResponse<TResponse>,
    unknown,
    MutationParams<TData>
> => {
    const axios = useAxios();

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ endpoint, method, data, config, id = '' }) => {
            try {
                const response = axios[method](`/${endpoint}${id ? `/${id}` : ''}`, data, config);
                return response;
            } catch (error) {
                throw error;
            }
        },
        onError(error, variables) {
            if (error instanceof Error) {
                (variables.toastOnError ?? true) && toast.error(error.message);
            } else if (error instanceof AxiosError) {
                (variables.toastOnError ?? true) && toast.error(`${error.message}`);
            }
            console.log(error)
        },
        onSuccess(data, variables) {
            if (variables.invalidateTags) {
                queryClient.invalidateQueries({
                    queryKey: variables.invalidateTags,
                })
            }

            (variables.toastOnSuccess ?? true) && toast.success(data.data.message ?? 'Success!');
        },
    })
};