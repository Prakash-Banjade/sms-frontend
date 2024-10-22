import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TClass, } from "@/types/class.type";
import { TSubjectsResponse } from "@/types/subject.types";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetSubject = ({
    id,
    queryString,
    options,
}: {
    id: string;
    queryString?: string;
    options?: UseQueryOptions<TClass>
}) => {
    const response = useFetchData<TClass>({
        queryKey: [QueryKey.SUBJECTS, id],
        endpoint: QueryKey.SUBJECTS,
        id,
        queryString,
        options,
    })

    return response;
}

export const useGetSubjects = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TSubjectsResponse>
}) => {
    const response = useFetchData<TSubjectsResponse>({
        endpoint: QueryKey.SUBJECTS,
        queryKey: queryString ? [QueryKey.SUBJECTS, queryString] : [QueryKey.SUBJECTS],
        queryString,
        options,
    })

    return response;
}