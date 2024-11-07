import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TExamType, TExamTypesResponse } from "@/types/examination.type";
import { SelectOption } from "@/types/global.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetExamType = ({
    id,
    queryString,
    options,
}: {
    id: string;
    queryString?: string;
    options?: UseQueryOptions<TExamType>
}) => {
    const response = useFetchData<TExamType>({
        queryKey: [QueryKey.EXAM_TYPES, id],
        endpoint: QueryKey.EXAM_TYPES,
        id,
        queryString,
        options,
    })

    return response;
}

export const useGetExamTypes = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TExamTypesResponse>
}) => {
    const response = useFetchData<TExamTypesResponse>({
        endpoint: QueryKey.EXAM_TYPES,
        queryKey: queryString ? [QueryKey.EXAM_TYPES, queryString] : [QueryKey.EXAM_TYPES],
        queryString,
        options,
    })

    return response;
}

export const useGetExamTypeOptions = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<SelectOption[]>
}) => {
    const response = useFetchData<SelectOption[]>({
        endpoint: QueryKey.EXAM_TYPES + '/' + QueryKey.OPTIONS,
        queryKey: queryString ? [QueryKey.EXAM_TYPES, queryString] : [QueryKey.EXAM_TYPES],
        queryString,
        options,
    })

    return response;
}

