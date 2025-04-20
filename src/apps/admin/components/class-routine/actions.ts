import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TClassRoutineResponse } from "@/apps/admin/types/class-routine.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetClassRoutines = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<TClassRoutineResponse>>
}) => {
    const response = useFetchData<TClassRoutineResponse>({
        endpoint: QueryKey.CLASSROUTINE,
        queryKey: queryString ? [QueryKey.CLASSROUTINE, queryString] : [QueryKey.CLASSROUTINE],
        queryString,
        options,
    })

    return response;
}