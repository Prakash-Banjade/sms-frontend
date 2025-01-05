import { useFetchData } from "@/hooks/useFetchData";
import { TLoginDevice } from "@/types/account/account.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetSessionDevices = ({
    options,
}: {
    options?: UseQueryOptions<TLoginDevice[]>
}) => {
    const response = useFetchData<TLoginDevice[]>({
        endpoint: 'accounts/devices',
        queryKey: ['accounts/devices'],
        options,
    })

    return response;
}