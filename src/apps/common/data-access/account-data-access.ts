import { useFetchData } from "@/hooks/useFetchData";
import { QueryKey } from "@/react-query/queryKeys";
import { TLoginDevice } from "@/types/account/account.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetSessionDevices = ({
    options,
}: {
    options?: UseQueryOptions<TLoginDevice[]>
}) => {
    const response = useFetchData<TLoginDevice[]>({
        endpoint: QueryKey.ACCOUNTS_DEVICES,
        queryKey: [QueryKey.ACCOUNTS_DEVICES],
        options,
    })

    return response;
}