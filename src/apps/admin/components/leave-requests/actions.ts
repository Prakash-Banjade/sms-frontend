import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TStudentLeaveRequestsResponse } from "@/types/leave-request.type";
import { UseQueryOptions } from "@tanstack/react-query";

// export const useGetLeaveRequest = ({
//     id,
//     queryString,
//     options,
// }: {
//     id: string;
//     queryString?: string;
//     options?: UseQueryOptions<TSingleLeaveRequest>
// }) => {
//     const response = useFetchData<TSingleLeaveRequest>({
//         queryKey: [QueryKey.LEAVE_REQUESTS, id],
//         endpoint: QueryKey.LEAVE_REQUESTS,
//         id,
//         queryString,
//         options,
//     })

//     return response;
// }

export const useGetLeaveRequests = ({
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