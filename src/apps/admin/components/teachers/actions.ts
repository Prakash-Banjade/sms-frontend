import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TeacherClassSchedule, TeachersResponse, TeacherWithAttendanceResponse, TSingleTeacher } from "@/types/teacher.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetTeacher = <T = TSingleTeacher>({
    id,
    queryString,
    options,
}: {
    id: string;
    queryString?: string;
    options?: UseQueryOptions<T>
}) => {
    const response = useFetchData<T>({
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

export const useGetTeacherClassSchedule = <T = TeacherClassSchedule[],>({
    queryString,
    id,
    options,
}: {
    id: string;
    queryString?: string;
    options?: Partial<UseQueryOptions<T>>
}) => {
    const response = useFetchData<T>({
        endpoint: QueryKey.TEACHERS + '/' + id + '/class-schedule',
        queryKey: queryString ? [QueryKey.TEACHERS, id, 'class-schedule', queryString] : [QueryKey.TEACHERS, id, 'class-schedule'],
        queryString,
        options,
    })

    return response;
}