import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TasksResponse, TSingleTask } from "@/types/task.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetTask = ({
    id,
    queryString,
    options,
}: {
    id: string;
    queryString?: string;
    options?: UseQueryOptions<TSingleTask>
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

export const useGetTasks = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TasksResponse>
}) => {
    const response = useFetchData<TasksResponse>({
        endpoint: QueryKey.TASKS,
        queryKey: queryString ? [QueryKey.TASKS, queryString] : [QueryKey.TASKS],
        queryString,
        options,
    })

    return response;
}