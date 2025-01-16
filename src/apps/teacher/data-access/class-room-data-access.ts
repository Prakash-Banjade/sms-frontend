import { useFetchData } from "@/hooks/useFetchData";
import { TMeta } from "@/types/global.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const ASSIGNED_CLASSES = "class-rooms/assigned";

export type TAssignedClassRoom = {
    id: string,
    name: string,
    subjectId: string,
    subjectName: string;
}

export type TAssignedClassesResponse = {
    data: TAssignedClassRoom[],
    meta: TMeta,
}

export const useGetAssignedClasses = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TAssignedClassesResponse>
}) => {
    const response = useFetchData<TAssignedClassesResponse>({
        endpoint: ASSIGNED_CLASSES,
        queryKey: queryString ? [ASSIGNED_CLASSES, queryString] : [ASSIGNED_CLASSES],
        queryString,
        options,
    })

    return response;
}