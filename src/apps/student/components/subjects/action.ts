import { useFetchData } from "@/hooks/useFetchData";
import { QueryKey } from "@/react-query/queryKeys";
import { TSubjectPlan, TSubjectPlanResponse } from "@/types/subject-plan.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useSubject = ({
    id,
    queryString,
    options,
}: {
    id: string;
    queryString?: string;
    options?: UseQueryOptions<TSubjectPlan>
}) => {
    const response = useFetchData<TSubjectPlan>({
        queryKey: [QueryKey.SUBJECTS, id],
        endpoint: QueryKey.SUBJECTS,
        id,
        queryString,
        options,
    })

    return response;
}

export const useSubjects = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TSubjectPlanResponse>
}) => {
    const response = useFetchData<TSubjectPlanResponse>({
        endpoint: QueryKey.SUBJECTS,
        queryKey: queryString ? [QueryKey.SUBJECTS, queryString] : [QueryKey.SUBJECTS],
        queryString,
        options,
    })

    return response;
}