import { useFetchData } from "@/hooks/useFetchData";
import { QueryKey } from "@/react-query/queryKeys";
import { TLessonPlansResponse, TSingleLessonPlan } from "@/apps/admin/types/lesson-plan.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetLessonPlan = ({
    id,
    queryString,
    options,
}: {
    id: string;
    queryString?: string;
    options?: Partial<UseQueryOptions<TSingleLessonPlan>>
}) => {
    const response = useFetchData<TSingleLessonPlan>({
        queryKey: [QueryKey.LESSON_PLANS, id],
        endpoint: QueryKey.LESSON_PLANS,
        id,
        queryString,
        options,
    })

    return response;
}

export const useGetLessonPlans = <T = TLessonPlansResponse>({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<T>>
}) => {
    const response = useFetchData<T>({
        endpoint: QueryKey.LESSON_PLANS,
        queryKey: queryString ? [QueryKey.LESSON_PLANS, queryString] : [QueryKey.LESSON_PLANS],
        queryString,
        options,
    })

    return response;
}