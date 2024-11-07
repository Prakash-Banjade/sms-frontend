import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TRouteStop, TRouteStopsResponse } from "@/types/route-stop.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetRouteStop = ({
    queryString,
    options,
    id,
}: {
    id: string;
    queryString?: string;
    options?: UseQueryOptions<TRouteStop>
}) => {
    const response = useFetchData<TRouteStop>({
        endpoint: QueryKey.ROUTE_STOPS,
        queryKey: queryString ? [QueryKey.ROUTE_STOPS, id, queryString] : [QueryKey.ROUTE_STOPS, id],
        id,
        queryString,
        options,
    })

    return response;
}

export const useGetRouteStops = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TRouteStopsResponse>
}) => {
    const response = useFetchData<TRouteStopsResponse>({
        endpoint: QueryKey.ROUTE_STOPS,
        queryKey: queryString ? [QueryKey.ROUTE_STOPS, queryString] : [QueryKey.ROUTE_STOPS],
        queryString,
        options,
    })

    return response;
}