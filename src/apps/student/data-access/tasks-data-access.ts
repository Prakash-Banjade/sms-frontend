import { useFetchData } from "@/hooks/useFetchData";
import { QueryKey } from "@/react-query/queryKeys";
import { ETask, ETaskSubmissionStatus, TMeta } from "@/types/global.type";
import { UseQueryOptions } from "@tanstack/react-query";

export type Task_StudentResponse = {
    data: {
        id: string,
        title: string,
        description: string,
        deadline: string,
        taskType: ETask,
        marks: number,
        createdAt: string,
        subjectName: string,
        attachments: {
            id: string,
            url: string
            name: string
        }[] | string
    }[],
    meta: TMeta
}

export type TaskCounts = {
    pending: string,
    submitted: string,
    evaluated: string
}
export const useGetTaskCounts = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<TaskCounts>>
}) => {
    const response = useFetchData<TaskCounts>({
        endpoint: QueryKey.TASKS + '/counts',
        queryKey: queryString ? [QueryKey.TASKS, 'counts', queryString] : [QueryKey.TASKS, 'counts'],
        queryString,
        options,
    })

    return response;
}

export type TaskSubmissionsResponse = {
    data: {
        id: string,
        note: string,
        createdAt: string,
        status: ETaskSubmissionStatus,
        task: {
            id: string,
            title: string,
            deadline: string,
            subject: {
                id: string,
                subjectName: string,
                subjectCode: string
            }
        },
        attachments: {
            id: string,
            url: string
            originalName: string
        }[]
    }[],
    meta: TMeta;
}