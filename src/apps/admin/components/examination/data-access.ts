import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TExamReportsResponse, TExamsResponse, TExamStudent, TExamSubjectsResponse_Raw, TExamType, TExamTypesResponse, TMarkGradesResponse, TSingleExam } from "@/types/examination.type";
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

export const useGetMarkGrades = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TMarkGradesResponse>
}) => {
    const response = useFetchData<TMarkGradesResponse>({
        endpoint: QueryKey.MARKS_GRADES,
        queryKey: queryString ? [QueryKey.MARKS_GRADES, queryString] : [QueryKey.MARKS_GRADES],
        queryString,
        options,
    })

    return response;
}

export const useGetExams = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TExamsResponse>
}) => {
    const response = useFetchData<TExamsResponse>({
        endpoint: QueryKey.EXAMS,
        queryKey: queryString ? [QueryKey.EXAMS, queryString] : [QueryKey.EXAMS],
        queryString,
        options,
    })

    return response;
}

export const useGetExam = ({
    id,
    queryString,
    options,
}: {
    id: string;
    queryString?: string;
    options?: Partial<UseQueryOptions<TSingleExam>>
}) => {
    const response = useFetchData<TSingleExam>({
        queryKey: [QueryKey.EXAMS, id],
        endpoint: QueryKey.EXAMS,
        id,
        queryString,
        options,
    })

    return response;
}

export const useGetExamStudents = ({
    id,
    queryString,
    options,
}: {
    id: string;
    queryString?: string;
    options?: Partial<UseQueryOptions<TExamStudent[]>>
}) => {
    const response = useFetchData<TExamStudent[]>({
        queryKey: [QueryKey.EXAMS, id, QueryKey.STUDENTS],
        endpoint: QueryKey.EXAMS + '/' + id + '/' + QueryKey.STUDENTS,
        queryString,
        options,
    })

    return response;
}

export const useGetExamSubjects = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<TExamSubjectsResponse_Raw>>
}) => {
    const response = useFetchData<TExamSubjectsResponse_Raw>({
        queryKey: queryString ? [QueryKey.EXAM_SUBJECTS, queryString] : [QueryKey.EXAM_SUBJECTS],
        endpoint: QueryKey.EXAM_SUBJECTS,
        queryString,
        options,
    })

    return response;
}

export const useGetExamReports = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<TExamReportsResponse>>
}) => {
    const response = useFetchData<TExamReportsResponse>({
        queryKey: queryString ? [QueryKey.EXAM_REPORTS, queryString] : [QueryKey.EXAM_REPORTS],
        endpoint: QueryKey.EXAM_REPORTS,
        queryString,
        options,
    })

    return response;
}