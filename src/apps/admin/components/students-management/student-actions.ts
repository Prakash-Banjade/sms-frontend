import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TLibraryStudent, TSingleStudent, TStudent_BasicInfoResponse, TStudentsResponse, TStudentsWithAttendenceResponse } from "@/apps/admin/types/student.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetStudent = ({
    id,
    queryString,
    options,
}: {
    id: string;
    queryString?: string;
    options?: Partial<UseQueryOptions<TSingleStudent>>
}) => {
    const response = useFetchData<TSingleStudent>({
        queryKey: [QueryKey.STUDENTS, id],
        endpoint: QueryKey.STUDENTS,
        id,
        queryString,
        options,
    })

    return response;
}

export const useGetStudents = <T = TStudentsResponse>({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<T>>
}) => {
    const response = useFetchData<T>({
        endpoint: QueryKey.STUDENTS,
        queryKey: queryString ? [QueryKey.STUDENTS, queryString] : [QueryKey.STUDENTS],
        queryString,
        options,
    })

    return response;
}

export const useGetPastStudents = <T = TStudent_BasicInfoResponse>({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<T>>
}) => {
    const response = useFetchData<T>({
        endpoint: QueryKey.STUDENTS + '/' + 'past',
        queryKey: queryString ? [QueryKey.STUDENTS, 'past', queryString] : [QueryKey.STUDENTS, 'past'],
        queryString,
        options,
    })

    return response;
}

export const useGetStudentsWithAttendances = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<TStudentsWithAttendenceResponse>>
}) => {
    const response = useFetchData<TStudentsWithAttendenceResponse>({
        endpoint: QueryKey.STUDENTS + '/' + QueryKey.ATTENDANCES,
        queryKey: queryString ? [QueryKey.STUDENTS, queryString] : [QueryKey.STUDENTS],
        queryString,
        options,
    })

    return response;
}

export const useGetLibraryStudent = ({
    id,
    queryString,
    options,
}: {
    id: string;
    queryString?: string;
    options?: Partial<UseQueryOptions<TLibraryStudent>>
}) => {
    const response = useFetchData<TLibraryStudent>({
        queryKey: [QueryKey.STUDENTS, QueryKey.LIBRARY, id],
        endpoint: QueryKey.STUDENTS + '/' + QueryKey.LIBRARY,
        id,
        queryString,
        options,
    })

    return response;
}




