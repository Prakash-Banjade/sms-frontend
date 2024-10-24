import { useFetchData } from "@/hooks/useFetchData";
import { QueryKey } from "@/react-query/queryKeys";
import { TNoticeResponse } from "@/types/notice.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useNotices = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TNoticeResponse>
}) => {
    const response = useFetchData<TNoticeResponse>({
        endpoint: QueryKey.NOTICES,
        queryKey: queryString ? [QueryKey.NOTICES, queryString] : [QueryKey.NOTICES],
        queryString,
        options,
    })

    return response;
}
