import { useFetchData } from "@/hooks/useFetchData";
import { QueryKey } from "@/react-query/queryKeys";
import { TMeta } from "@/types/global.type";
import { UseQueryOptions } from "@tanstack/react-query";

export type TFaculty = {
    id: string;
    name: string;
    description: string | null;
}

export type TFacultiesResponse = {
    data: TFaculty[];
    meta: TMeta;
}

export const useGetFaculties = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<TFacultiesResponse>>
}) => {
    const response = useFetchData<TFacultiesResponse>({
        endpoint: QueryKey.FACULTIES,
        queryKey: queryString ? [QueryKey.FACULTIES, queryString] : [QueryKey.FACULTIES],
        queryString,
        options,
    })

    return response;
}

export type TSingleFaculty = TFaculty & {
    description: string;
}

export const useGetSingleFaculty = ({
    id,
    options
}: {
    id: string;
    options?: Partial<UseQueryOptions<TSingleFaculty>>
}) => {
    const response = useFetchData<TSingleFaculty>({
        endpoint: `${QueryKey.FACULTIES}`,
        id,
        queryKey: [QueryKey.FACULTIES, id],
        options,
    })

    return response;
}