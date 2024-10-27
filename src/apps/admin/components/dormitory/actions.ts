import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TDormitoryResponse, TDormitoryRoom, TDormitoryRoomResponse, TRoomTypeResponse } from "@/types/dormitory.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetRoomTypes = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TRoomTypeResponse>
}) => {
    const response = useFetchData<TRoomTypeResponse>({
        endpoint: QueryKey.ROOM_TYPES,
        queryKey: queryString ? [QueryKey.ROOM_TYPES, queryString] : [QueryKey.ROOM_TYPES],
        queryString,
        options,
    })

    return response;
}

export const useGetDormitories = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TDormitoryResponse>
}) => {
    const response = useFetchData<TDormitoryResponse>({
        endpoint: QueryKey.DORMITORY,
        queryKey: queryString ? [QueryKey.DORMITORY, queryString] : [QueryKey.DORMITORY],
        queryString,
        options,
    })

    return response;
}

export const useGetDormitoryRooms = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TDormitoryRoomResponse>
}) => {
    const response = useFetchData<TDormitoryRoomResponse>({
        endpoint: QueryKey.DORMITORY_ROOMS,
        queryKey: queryString ? [QueryKey.DORMITORY_ROOMS, queryString] : [QueryKey.DORMITORY_ROOMS],
        queryString,
        options,
    })

    return response;
}