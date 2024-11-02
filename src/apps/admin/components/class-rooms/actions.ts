import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TClass, TClassesResponse, TClassRoomOptions } from "@/types/class.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetClass = ({
    id,
    queryString,
    options,
}: {
    id: string;
    queryString?: string;
    options?: UseQueryOptions<TClass>
}) => {
    const response = useFetchData<TClass>({
        queryKey: [QueryKey.CLASSES, id],
        endpoint: QueryKey.CLASSES,
        id,
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

export const useGetSections = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TClassesResponse>
}) => {
    const response = useFetchData<TClassesResponse>({
        endpoint: QueryKey.CLASSES + '/' + QueryKey.SECTIONS,
        queryKey: queryString ? [QueryKey.CLASSES, QueryKey.SECTIONS, queryString] : [QueryKey.CLASSES, QueryKey.SECTIONS],
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