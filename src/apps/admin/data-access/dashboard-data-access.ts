import { useFetchData } from "@/hooks/useFetchData";
import { QueryKey } from "@/react-query/queryKeys";
import { TAdminDashboardCount, TDashboardLeaveRequests } from "@/types/dashboard.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetAdminDashboard = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<TAdminDashboardCount>>
}) => {
    const response = useFetchData<TAdminDashboardCount>({
        queryKey: queryString ? [QueryKey.DASHBOARD, 'count', queryString] : [QueryKey.DASHBOARD, 'count'],
        endpoint: QueryKey.DASHBOARD + '/admin/counts',
        queryString,
        options,
    });

    return response;
}

export const useGetAdminDashboardLeaveRequests = ({
    options,
}: {
    options?: Partial<UseQueryOptions<TDashboardLeaveRequests>>
}) => {
    const response = useFetchData<TDashboardLeaveRequests>({
        queryKey: [QueryKey.LEAVE_REQUESTS],
        endpoint: QueryKey.DASHBOARD + '/leave-requests',
        options,
    });

    return response;
}