import { useFetchData } from "@/hooks/useFetchData";
import { QueryKey } from "@/react-query/queryKeys";
import { TSalaryStructureResponse } from "@/types/finance-system/salary-management.types";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetSalaryStructures = <T = TSalaryStructureResponse>({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<T>>
}) => {
    const response = useFetchData<T>({
        endpoint: QueryKey.SALARY_STRUCTURES,
        queryKey: queryString ? [QueryKey.SALARY_STRUCTURES, queryString] : [QueryKey.SALARY_STRUCTURES],
        queryString,
        options,
    })

    return response;
}