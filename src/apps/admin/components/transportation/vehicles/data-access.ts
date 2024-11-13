import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TSingleVehicle, TVehiclesResponse } from "@/types/vehicle.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetVehicle = ({
    queryString,
    options,
    id,
}: {
    id: string;
    queryString?: string;
    options?: UseQueryOptions<TSingleVehicle>
}) => {
    const response = useFetchData<TSingleVehicle>({
        endpoint: QueryKey.VEHICLES,
        queryKey: queryString ? [QueryKey.ROOM_TYPES, id, queryString] : [QueryKey.ROOM_TYPES, id],
        id,
        queryString,
        options,
    })

    return response;
}

export const useGetVehicles = <T = TVehiclesResponse>({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<T>
}) => {
    const response = useFetchData<T>({
        endpoint: QueryKey.VEHICLES,
        queryKey: queryString ? [QueryKey.VEHICLES, queryString] : [QueryKey.VEHICLES],
        queryString,
        options,
    })

    return response;
}