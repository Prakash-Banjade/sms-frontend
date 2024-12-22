import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { UseQueryOptions } from "@tanstack/react-query";
import { TUserResponse } from "../types/users.type";

export const useGetUsers = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<TUserResponse>>
}) => {
    const response = useFetchData<TUserResponse>({
        endpoint: QueryKey.USERS,
        queryKey: queryString ? [QueryKey.USERS, queryString] : [QueryKey.USERS],
        queryString,
        options,
    })

    return response;
}