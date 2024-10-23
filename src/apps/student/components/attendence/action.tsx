import { useFetchData } from "@/hooks/useFetchData";
import { QueryKey } from "@/react-query/queryKeys";
import { TAttendence, TAttendencesResponse } from "@/types/attendence.type";


import { UseQueryOptions } from "@tanstack/react-query";

export const useAttendence = ({
    id,
    queryString,
    options,
}: {
    id: string;
    queryString?: string;
    options?: UseQueryOptions<TAttendence>
}) => {
    const response = useFetchData<TAttendence>({
        queryKey: [QueryKey.ATTENDANCES, id],
        endpoint: QueryKey.ATTENDANCES,
        id,
        queryString,
        options,
    })

    return response;
}

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