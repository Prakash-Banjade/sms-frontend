import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TAttendenceCounts, TAttendencesResponse } from "@/types/attendence.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetAttendances = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TAttendencesResponse>
}) => {
    const response = useFetchData<TAttendencesResponse>({
        queryKey: queryString ? [QueryKey.ATTENDANCES, queryString] : [QueryKey.ATTENDANCES],
        endpoint: QueryKey.ATTENDANCES,
        queryString,
        options,
    })

    return response;
}

export const useGetAttendanceCounts = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TAttendenceCounts>
}) => {
    const response = useFetchData<TAttendenceCounts>({
        queryKey: queryString ? [QueryKey.ATTENDANCES, queryString] : [QueryKey.ATTENDANCES],
        endpoint: QueryKey.ATTENDANCES + '/count',
        queryString,
        options,
    })

    return response;
}
