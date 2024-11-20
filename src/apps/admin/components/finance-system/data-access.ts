import { useFetchData } from "@/hooks/useFetchData";
import { QueryKey } from "@/react-query/queryKeys";
import { TChargeHeadsResponse, TFeeStructuresResponse, TFeeStudent } from "@/types/finance-system/finance.types";
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
        queryKey: [QueryKey.STUDENTS, id],
        endpoint: QueryKey.STUDENTS + '/fee',
        id,
        queryString,
        options,
    })

    return response;
}