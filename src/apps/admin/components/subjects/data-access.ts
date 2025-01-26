import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TSubject, TSubjectChaptersResponse, TSubjectsResponse } from "@/types/subject.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetSubject = ({
    id,
    queryString,
    options,
}: {
    id: string;
    queryString?: string;
    options?: UseQueryOptions<TSubject>
}) => {
    const response = useFetchData<TSubject>({
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
    options?: Partial<UseQueryOptions<TSubjectsResponse>>
}) => {
    const response = useFetchData<TSubjectsResponse>({
        endpoint: QueryKey.SUBJECTS,
        queryKey: queryString ? [QueryKey.SUBJECTS, queryString] : [QueryKey.SUBJECTS],
        queryString,
        options,
    })

    return response;
}

export const useGetSubjectChapters = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TSubjectChaptersResponse>
}) => {
    const response = useFetchData<TSubjectChaptersResponse>({
        endpoint: QueryKey.SUBJECT_CHAPTERS,
        queryKey: queryString ? [QueryKey.SUBJECT_CHAPTERS, queryString] : [QueryKey.SUBJECT_CHAPTERS],
        queryString,
        options,
    })

    return response;
}

export const useGetSubjectOptions = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<Pick<TSubject, 'id' | 'subjectName'>[]>>
}) => {
    const response = useFetchData<Pick<TSubject, 'id' | 'subjectName'>[]>({
        endpoint: QueryKey.SUBJECTS + '/' + QueryKey.OPTIONS,
        queryKey: queryString ? [QueryKey.SUBJECTS, QueryKey.OPTIONS, queryString] : [QueryKey.SUBJECTS, QueryKey.OPTIONS],
        queryString,
        options,
    })

    return response;
}