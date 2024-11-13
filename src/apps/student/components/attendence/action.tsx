import { useFetchData } from "@/hooks/useFetchData";
import { QueryKey } from "@/react-query/queryKeys";
import { TAttendenceCounts, TAttendencesResponse } from "@/types/attendence.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useAttendences = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TAttendencesResponse>
}) => {
    const response = useFetchData<TAttendencesResponse>({
        endpoint: QueryKey.ATTENDANCES,
        queryKey: queryString ? [QueryKey.ATTENDANCES, queryString] : [QueryKey.ATTENDANCES],
        queryString,
        options,
    })

    return response;
}

export const useAttendenceCounts = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TAttendenceCounts>
}) => {
    const response = useFetchData<TAttendenceCounts>({
        endpoint: QueryKey.ATTENDANCE_COUNT,
        queryKey: queryString ? [QueryKey.ATTENDANCE_COUNT, queryString] : [QueryKey.ATTENDANCE_COUNT],
        queryString,
        options,
    })

    return response;
}