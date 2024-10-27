import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TeachersResponse, TSingleTeacher } from "@/types/teacher.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetTeacher = ({
    id,
    queryString,
    options,
}: {
    id: string;
    queryString?: string;
    options?: UseQueryOptions<TSingleTeacher>
}) => {
    const response = useFetchData<TSingleTeacher>({
        queryKey: [QueryKey.TEACHERS, id],
        endpoint: QueryKey.TEACHERS,
        id,
        queryString,
        options,
    })

    return response;
}

export const useGetTeachers = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TeachersResponse>
}) => {
    const response = useFetchData<TeachersResponse>({
        endpoint: QueryKey.TEACHERS,
        queryKey: queryString ? [QueryKey.TEACHERS, queryString] : [QueryKey.TEACHERS],
        queryString,
        options,
    })

    return response;
}