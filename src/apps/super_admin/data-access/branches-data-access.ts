import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { SelectOption } from "@/types/global.type";
import { UseQueryOptions } from "@tanstack/react-query";
import { TBranchesResponse } from "../types/branch.type";

export const useGetBranches = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<TBranchesResponse>>
}) => {
    const response = useFetchData<TBranchesResponse>({
        endpoint: QueryKey.BRANCHES,
        queryKey: queryString ? [QueryKey.BRANCHES, queryString] : [QueryKey.BRANCHES],
        queryString,
        options,
    })

    return response;
}

export const useGetBranchOptions = ({
    options,
}: {
    options?: Partial<UseQueryOptions<SelectOption[]>>
}) => {
    const response = useFetchData<SelectOption[]>({
        endpoint: QueryKey.BRANCHES + '/' + QueryKey.OPTIONS,
        queryKey: [QueryKey.BRANCHES, QueryKey.OPTIONS],
        options,
    })

    return response;
}
