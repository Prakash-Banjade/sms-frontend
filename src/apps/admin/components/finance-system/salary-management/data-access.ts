import { useFetchData } from "@/hooks/useFetchData";
import { QueryKey } from "@/react-query/queryKeys";
import { TEmployees, TLastPayroll, TSalaryEmployee, TSalaryPaymentResponse, TSalaryStructureResponse } from "@/types/finance-system/salary-management.types";
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

export const useGetSalaryEmployee = <T = TSalaryEmployee>({
    options,
    id,
}: {
    id: string;
    options?: Partial<UseQueryOptions<T>>;
}) => {
    const response = useFetchData<T>({
        endpoint: QueryKey.PAYROLLS + '/employees/' + id,
        queryKey: [QueryKey.PAYROLLS, 'employees', id],
        options,
    })

    return response;
};

export const useGetLastPayroll = <T = TLastPayroll>({
    options,
    id,
}: {
    id: string;
    options?: Partial<UseQueryOptions<T>>;
}) => {
    const response = useFetchData<T>({
        endpoint: QueryKey.PAYROLLS + '/employees/' + id + '/last-payroll',
        queryKey: [QueryKey.PAYROLLS, 'employees', id, 'last-payroll'],
        options,
    })

    return response;
};

export const useGetSalaryPayments = <T = TSalaryPaymentResponse>({
    options,
    queryString,
}: {
    options?: Partial<UseQueryOptions<T>>;
    queryString?: string;
}) => {
    const response = useFetchData<T>({
        endpoint: QueryKey.SALARY_PAYMENTS,
        queryString,
        queryKey: queryString ? [QueryKey.SALARY_PAYMENTS, queryString] : [QueryKey.SALARY_PAYMENTS],
        options,
    })

    return response;
};