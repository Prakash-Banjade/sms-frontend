import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TEnrollmentsResponse } from "@/apps/admin/types/enrollment.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetEnrollments = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TEnrollmentsResponse>
}) => {
    const response = useFetchData<TEnrollmentsResponse>({
        endpoint: QueryKey.ENROLLMENTS,
        queryKey: queryString ? [QueryKey.ENROLLMENTS, queryString] : [QueryKey.ENROLLMENTS],
        queryString,
        options,
    })

    return response;
}