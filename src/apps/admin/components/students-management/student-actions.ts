import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { StaffWithAttendanceResponse } from "@/types/staff.type";
import { TSingleStudent, TStudentsResponse, TStudentsWithAttendenceResponse } from "@/types/student.type";
import { TeacherWithAttendanceResponse } from "@/types/teacher.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetStudent = ({
    id,
    queryString,
    options,
}: {
    id: string;
    queryString?: string;
    options?: UseQueryOptions<TSingleStudent>
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

export const useGetStudents = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TStudentsResponse>
}) => {
    const response = useFetchData<TStudentsResponse>({
        endpoint: QueryKey.STUDENTS,
        queryKey: queryString ? [QueryKey.STUDENTS, queryString] : [QueryKey.STUDENTS],
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

export const useGetTeachersWithAttendances = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<TeacherWithAttendanceResponse>>
}) => {
    const response = useFetchData<TeacherWithAttendanceResponse>({
        endpoint: QueryKey.TEACHERS + '/' + QueryKey.ATTENDANCES,
        queryKey: queryString ? [QueryKey.TEACHERS, queryString] : [QueryKey.TEACHERS],
        queryString,
        options,
    })

    return response;
}

export const useGetStaffsWithAttendances = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<StaffWithAttendanceResponse>>
}) => {
    const response = useFetchData<StaffWithAttendanceResponse>({
        endpoint: QueryKey.STAFFS + '/' + QueryKey.ATTENDANCES,
        queryKey: queryString ? [QueryKey.STAFFS, queryString] : [QueryKey.STAFFS],
        queryString,
        options,
    })

    return response;
}