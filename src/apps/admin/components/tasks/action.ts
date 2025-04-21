import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TasksResponse, TaskSubmissionsResponse, TSingleTask, TSingleTaskStatistics } from "@/apps/admin/types/task.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetTask = ({
    id,
    queryString,
    options,
}: {
    id: string;
    queryString?: string;
    options?: Partial<UseQueryOptions<TSingleTask>>
}) => {
    const response = useFetchData<TSingleTask>({
        queryKey: [QueryKey.TASKS, id],
        endpoint: QueryKey.TASKS,
        id,
        queryString,
        options,
    })

    return response;
}

export const useGetTasks = <T = TasksResponse>({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<T>
}) => {
    const response = useFetchData<T>({
        endpoint: QueryKey.TASKS,
        queryKey: queryString ? [QueryKey.TASKS, queryString] : [QueryKey.TASKS],
        queryString,
        options,
    })

    return response;
}

export const useGetTaskStatistics = ({
    queryString,
    options,
    id,
}: {
    id: string
    queryString?: string;
    options?: UseQueryOptions<TSingleTaskStatistics>
}) => {
    const response = useFetchData<TSingleTaskStatistics>({
        endpoint: QueryKey.TASKS + `/${id}/statistics`,
        queryKey: [QueryKey.TASKS, id, "statistics"],
        queryString,
        options,
    })

    return response;
}

export const useGetTaskSubmissions = <T = TaskSubmissionsResponse>({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<T>
}) => {
    const response = useFetchData<T>({
        endpoint: QueryKey.TASK_SUBMISSIONS,
        queryKey: queryString ? [QueryKey.TASK_SUBMISSIONS, queryString] : [QueryKey.TASK_SUBMISSIONS],
        queryString,
        options,
    })

    return response;
}