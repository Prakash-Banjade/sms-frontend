import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TSingleStaff, TStaffsResponse } from "@/types/staff.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetStaff = ({
    id,
    queryString,
    options,
}: {
    id: string;
    queryString?: string;
    options?: UseQueryOptions<TSingleStaff>
}) => {
    const response = useFetchData<TSingleStaff>({
        queryKey: [QueryKey.STAFFS, id],
        endpoint: QueryKey.STAFFS,
        id,
        queryString,
        options,
    })

    return response;
}

export const useGetStaffs = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TStaffsResponse>
}) => {
    const response = useFetchData<TStaffsResponse>({
        endpoint: QueryKey.STAFFS,
        queryKey: queryString ? [QueryKey.STAFFS, queryString] : [QueryKey.STAFFS],
        queryString,
        options,
    })

    return response;
}