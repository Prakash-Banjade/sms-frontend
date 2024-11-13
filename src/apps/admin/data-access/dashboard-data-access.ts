import { useFetchData } from "@/hooks/useFetchData";
import { QueryKey } from "@/react-query/queryKeys";
import { TAdminDashboard } from "@/types/dashboard.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetAdminDashboard = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<TAdminDashboard>>
}) => {
    const response = useFetchData<TAdminDashboard>({
        queryKey: queryString ? [QueryKey.DASHBOARD, queryString] : [QueryKey.DASHBOARD],
        endpoint: QueryKey.DASHBOARD + '/admin',
        queryString,
        options,
    });

    return response;
}