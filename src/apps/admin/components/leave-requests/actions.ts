import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TEmployeeLeaveRequestsResponse, TStudentLeaveRequestsResponse } from "@/apps/admin/types/leave-request.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetStudentsLeaveRequests = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TStudentLeaveRequestsResponse>
}) => {
    const response = useFetchData<TStudentLeaveRequestsResponse>({
        endpoint: QueryKey.LEAVE_REQUESTS,
        queryKey: queryString ? [QueryKey.LEAVE_REQUESTS, queryString] : [QueryKey.LEAVE_REQUESTS],
        queryString,
        options,
    })

    return response;
}

export const useGetEmployeesLeaveRequests = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TEmployeeLeaveRequestsResponse>
}) => {
    const response = useFetchData<TEmployeeLeaveRequestsResponse>({
        endpoint: QueryKey.LEAVE_REQUESTS + '/' + QueryKey.EMPLOYEES,
        queryKey: queryString ? [QueryKey.LEAVE_REQUESTS, QueryKey.EMPLOYEES, queryString] : [QueryKey.LEAVE_REQUESTS, QueryKey.EMPLOYEES],
        queryString,
        options,
    })

    return response;
}