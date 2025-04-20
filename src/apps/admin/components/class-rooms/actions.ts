import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TClassesResponse, TClassRoomOptions, TSingleClassRoom } from "@/apps/admin/types/class.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetClass = ({
    id,
    queryString,
    options,
}: {
    id: string;
    queryString?: string;
    options?: UseQueryOptions<TSingleClassRoom>
}) => {
    const response = useFetchData<TSingleClassRoom>({
        queryKey: [QueryKey.CLASSES, id],
        endpoint: `${QueryKey.CLASSES}/${id}/${QueryKey.DETAILS}`,
        queryString,
        options,
    })

    return response;
}

export const useGetClasses = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TClassesResponse>
}) => {
    const response = useFetchData<TClassesResponse>({
        endpoint: QueryKey.CLASSES,
        queryKey: queryString ? [QueryKey.CLASSES, queryString] : [QueryKey.CLASSES],
        queryString,
        options,
    })

    return response;
}

export const useGetClassRoomsOptions = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<TClassRoomOptions>>;
}) => {
    const response = useFetchData<TClassRoomOptions>({
        endpoint: QueryKey.CLASSES + '/' + QueryKey.OPTIONS,
        queryKey: queryString ? [QueryKey.CLASSES, queryString] : [QueryKey.CLASSES],
        queryString,
        options,
    })

    return response;
}