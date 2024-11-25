import { useFetchData } from "@/hooks/useFetchData";
import { QueryKey } from "@/react-query/queryKeys";
import { TChargeHeadsResponse, TFeeStructuresResponse, TFeeStudent, TLastInvoice, TSingleInvoice, TSinglePayment, TStudentLedgerResponse } from "@/types/finance-system/finance.types";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetChargeHeads = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<TChargeHeadsResponse>>
}) => {
    const response = useFetchData<TChargeHeadsResponse>({
        endpoint: QueryKey.CHARGE_HEADS,
        queryKey: queryString ? [QueryKey.CHARGE_HEADS, queryString] : [QueryKey.CHARGE_HEADS],
        queryString,
        options,
    })

    return response;
}

export const useGetFeeStructures = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<TFeeStructuresResponse>>
}) => {
    const response = useFetchData<TFeeStructuresResponse>({
        endpoint: QueryKey.FEE_STRUCTURES,
        queryKey: queryString ? [QueryKey.FEE_STRUCTURES, queryString] : [QueryKey.FEE_STRUCTURES],
        queryString,
        options,
    })

    return response;
}

export const useGetFeeStudent = ({
    id,
    queryString,
    options,
}: {
    id: string;
    queryString?: string;
    options?: Partial<UseQueryOptions<TFeeStudent>>
}) => {
    const response = useFetchData<TFeeStudent>({
        queryKey: ['feeStudent'],
        endpoint: QueryKey.STUDENTS + '/fee',
        id,
        queryString,
        options,
    })

    return response;
}

export const useGetStudentLedger = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<TStudentLedgerResponse>>
}) => {
    const response = useFetchData<TStudentLedgerResponse>({
        queryKey: queryString ? [QueryKey.STUDENT_LEDGERS, queryString] : [QueryKey.STUDENT_LEDGERS],
        endpoint: QueryKey.STUDENT_LEDGERS,
        queryString,
        options,
    })

    return response;
}

export const useGetLastInvoice = ({
    queryString,
    options,
    studentId,
}: {
    studentId: string;
    queryString?: string;
    options?: Partial<UseQueryOptions<TLastInvoice>>
}) => {
    const response = useFetchData<TLastInvoice>({
        queryKey: queryString ? [QueryKey.FEE_INVOICES, 'last-invoice', queryString] : [QueryKey.FEE_INVOICES, 'last-invoice'],
        endpoint: QueryKey.FEE_INVOICES + '/last-invoice/' + studentId,
        queryString,
        options,
    })

    return response;
}

export const useGetInvoice = ({
    queryString,
    options,
    id,
}: {
    id: string;
    queryString?: string;
    options?: Partial<UseQueryOptions<TSingleInvoice>>
}) => {
    const response = useFetchData<TSingleInvoice>({
        queryKey: queryString ? [QueryKey.FEE_INVOICES, id, queryString] : [QueryKey.FEE_INVOICES, id],
        endpoint: QueryKey.FEE_INVOICES,
        id,
        queryString,
        options,
    })

    return response;
}

export const useGetPayment = ({
    queryString,
    options,
    id,
}: {
    id: string;
    queryString?: string;
    options?: Partial<UseQueryOptions<TSinglePayment>>
}) => {
    const response = useFetchData<TSinglePayment>({
        queryKey: queryString ? [QueryKey.FEE_PAYMENTS, id, queryString] : [QueryKey.FEE_PAYMENTS, id],
        endpoint: QueryKey.FEE_PAYMENTS,
        id,
        queryString,
        options,
    })

    return response;
}