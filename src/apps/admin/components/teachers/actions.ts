import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TeachersResponse, TeacherWithAttendanceResponse, TSingleTeacher } from "@/types/teacher.type";
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

export const useGetTeachers = <T = TeachersResponse,>({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<T>
}) => {
    const response = useFetchData<T>({
        endpoint: QueryKey.TEACHERS,
        queryKey: queryString ? [QueryKey.TEACHERS, queryString] : [QueryKey.TEACHERS],
        queryString,
        options,
    })

    return response;
}

export const useGetTeachersWithAttendances = <T = TeacherWithAttendanceResponse,>({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<T>>
}) => {
    const response = useFetchData<T>({
        endpoint: QueryKey.TEACHERS + '/' + QueryKey.ATTENDANCES,
        queryKey: queryString ? [QueryKey.TEACHERS, queryString] : [QueryKey.TEACHERS],
        queryString,
        options,
    })

    return response;
}