import { useFetchData } from "@/hooks/useFetchData";
import { QueryKey } from "@/react-query/queryKeys";
import { TEmployees, TSinglePayroll, TSalaryEmployee, TSalaryPaymentResponse, TSalaryPayrollsResponse, TSalaryStructureResponse } from "@/apps/admin/types/finance-system/salary-management.types";
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
    id?: string; // teacher don't need to send id
    options?: Partial<UseQueryOptions<T>>;
}) => {
    const response = useFetchData<T>({
        endpoint: id ? `${QueryKey.PAYROLLS}/salary-employee?employeeId=${id}` : `${QueryKey.PAYROLLS}/salary-employee`,
        queryKey: id ? [QueryKey.PAYROLLS, 'salary-employee', id] : [QueryKey.PAYROLLS, 'salary-employee'],
        options,
    })

    return response;
};

export const useGetLastPayroll = <T = TSinglePayroll>({
    options,
    id,
}: {
    id?: string;
    options?: Partial<UseQueryOptions<T>>;
}) => {
    const response = useFetchData<T>({
        endpoint: id ? `${QueryKey.PAYROLLS}/employees/last-payroll?employeeId=${id}` : `${QueryKey.PAYROLLS}/employees/last-payroll`,
        queryKey: id ? [QueryKey.PAYROLLS, 'employees', id, 'last-payroll'] : [QueryKey.PAYROLLS, 'employees', 'last-payroll'],
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

// export const useGetSalaryPayment = <T = TSalaryPaymentResponse>({
//     options,
//     id,
//     queryString,
// }: {
//     id: string
//     options?: Partial<UseQueryOptions<T>>;
//     queryString?: string;
// }) => {
//     const response = useFetchData<T>({
//         endpoint: QueryKey.SALARY_PAYMENTS,
//         queryString,
//         queryKey: queryString ? [QueryKey.SALARY_PAYMENTS, queryString, id] : [QueryKey.SALARY_PAYMENTS, id],
//         options,
//     })

//     return response;
// };

export const useGetSalaryPayrolls = <T = TSalaryPayrollsResponse>({
    options,
    queryString,
}: {
    options?: Partial<UseQueryOptions<T>>;
    queryString?: string;
}) => {
    const response = useFetchData<T>({
        endpoint: QueryKey.PAYROLLS,
        queryString,
        queryKey: queryString ? [QueryKey.PAYROLLS, queryString] : [QueryKey.PAYROLLS],
        options,
    })

    return response;
};

export const useGetSalaryPayroll = <T = TSinglePayroll>({
    options,
    id,
    queryString,
}: {
    id: string,
    options?: Partial<UseQueryOptions<T>>;
    queryString?: string;
}) => {
    const response = useFetchData<T>({
        endpoint: QueryKey.PAYROLLS + '/' + id,
        queryString,
        queryKey: queryString ? [QueryKey.PAYROLLS, queryString, id] : [QueryKey.PAYROLLS, id],
        options,
    })

    return response;
};

