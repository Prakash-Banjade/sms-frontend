import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TEvent, TEventsResponse } from "@/types/event.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetEvent = ({
    id,
    queryString,
    options,
}: {
    id: string;
    queryString?: string;
    options?: Partial<UseQueryOptions<TEvent>>
}) => {
    const response = useFetchData<TEvent>({
        queryKey: [QueryKey.EVENTS, id],
        endpoint: `${QueryKey.EVENTS}/${id}/${QueryKey.DETAILS}`,
        queryString,
        options,
    })

    return response;
}

export const useGetEvents = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<TEventsResponse>>
}) => {
    const response = useFetchData<TEventsResponse>({
        endpoint: QueryKey.EVENTS,
        queryKey: queryString ? [QueryKey.EVENTS, queryString] : [QueryKey.EVENTS],
        queryString,
        options,
    })

    return response;
}