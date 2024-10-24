import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TClassRoutine, TClassRoutineResponse } from "@/types/class-routine.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetClassRoutine = ({
    id,
    queryString,
    options,
}: {
    id: string;
    queryString?: string;
    options?: UseQueryOptions<TClassRoutine>
}) => {
    const response = useFetchData<TClassRoutine>({
        queryKey: [QueryKey.CLASSROUTINE, id],
        endpoint: QueryKey.CLASSROUTINE,
        id,
        queryString,
        options,
    })

    return response;
}

export const useGetClassRoutines = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TClassRoutineResponse>
}) => {
    const response = useFetchData<TClassRoutineResponse>({
        endpoint: QueryKey.CLASSROUTINE,
        queryKey: queryString ? [QueryKey.CLASSROUTINE, queryString] : [QueryKey.CLASSROUTINE],
        queryString,
        options,
    })

    return response;
}