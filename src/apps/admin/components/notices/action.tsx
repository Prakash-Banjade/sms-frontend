import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TNoticesResponse, TSingleNotice } from "@/types/notice.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetNotice = ({
    id,
    queryString,
    options,
}: {
    id: string;
    queryString?: string;
    options?: Partial<UseQueryOptions<TSingleNotice>>
}) => {
    const response = useFetchData<TSingleNotice>({
        queryKey: [QueryKey.NOTICES, id],
        endpoint: QueryKey.NOTICES,
        id,
        queryString,
        options,
    })

    return response;
}

export const useGetNoticees = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TNoticesResponse>
}) => {
    const response = useFetchData<TNoticesResponse>({
        endpoint: QueryKey.NOTICES,
        queryKey: queryString ? [QueryKey.NOTICES, queryString] : [QueryKey.NOTICES],
        queryString,
        options,
    })

    return response;
}