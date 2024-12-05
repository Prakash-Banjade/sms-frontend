import { useFetchData } from "@/hooks/useFetchData";
import { QueryKey } from "@/react-query/queryKeys";
import { TEmployees, TSalaryStructureResponse } from "@/types/finance-system/salary-management.types";
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
};

export const useGetEmployees = <T = TEmployees>({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<T>>
}) => {
    const response = useFetchData<T>({
        endpoint: QueryKey.PAYROLLS + '/employees',
        queryKey: queryString ? [QueryKey.PAYROLLS, 'employees', queryString] : [QueryKey.PAYROLLS, 'employees'],
        queryString,
        options,
    })

    return response;
};