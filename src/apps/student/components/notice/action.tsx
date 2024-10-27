
import { QueryKey } from "@/react-query/queryKeys";
import { useAxios } from "@/services/api";
import { TNoticePage, TNoticeResponse } from "@/types/notice.type";
import { useInfiniteQuery, UseQueryOptions } from "@tanstack/react-query";


export const useNotices = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TNoticePage>
}) => {
    const axios = useAxios();
    const url = `/${QueryKey.NOTICES}${queryString ? `?${queryString}` : ''}`;

    const response = useInfiniteQuery({
        queryKey: ['notices'],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await axios.get(`${url}?page=${pageParam}`);
            return response.data;
        },
        getNextPageParam: (lastPage: TNoticeResponse): number | undefined => {
            // Check if there's a next page based on meta data
            return lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined;
        },
        ...options,
    });

    return response;
};
