import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { SelectOption } from "@/types/global.type";
import { StaffWithAttendanceResponse, TSingleStaff, TStaffsResponse } from "@/apps/admin/types/staff.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetStaff = <T = TSingleStaff>({
    id,
    queryString,
    options,
}: {
    id: string;
    queryString?: string;
    options?: Partial<UseQueryOptions<T>>
}) => {
    const response = useFetchData<T>({
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

export const useGetStaffOptions = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<SelectOption[]>>
}) => {
    const response = useFetchData<SelectOption[]>({
        endpoint: QueryKey.STAFFS + '/' + QueryKey.OPTIONS,
        queryKey: queryString ? [QueryKey.STAFFS, queryString] : [QueryKey.STAFFS],
        queryString,
        options,
    })

    return response;
}