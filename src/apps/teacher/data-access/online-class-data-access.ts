import { useFetchData } from "@/hooks/useFetchData";
import { QueryKey } from "@/react-query/queryKeys";
import { TMeta } from "@/types/global.type";
import { UseQueryOptions } from "@tanstack/react-query";

export enum EOnlineClassStatus {
    Scheduled = 'scheduled',
    Live = 'live',
    Completed = 'completed',
}

export type TOnlineClass = {
    id: string,
    title: string,
    status: EOnlineClassStatus,
    scheduleDate: string | null,
    teacherName: string,
    subjectName: string,
    classRoomName: string,
    description: string | null,
}

export type TOnlineClassesResponse = {
    data: TOnlineClass[]
    meta: TMeta;
}

export const useGetOnlineClasses = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TOnlineClassesResponse>
}) => {
    const response = useFetchData<TOnlineClassesResponse>({
        endpoint: QueryKey.ONLINE_CLASSES,
        queryKey: queryString ? [QueryKey.ONLINE_CLASSES, queryString] : [QueryKey.ONLINE_CLASSES],
        queryString,
        options,
    })

    return response;
}

export type TSingleOnlineClass = {
    id: string,
    createdAt: string,
    title: string,
    description: string | null,
    status: EOnlineClassStatus,
    scheduleDate: string | null,
    teacher: {
        id: string,
        firstName: string,
        lastName: string
    },
    classRoom: {
        id: string,
        name: string,
        parent: {
            id: true,
            name: true
        } | null;
    },
    subject: {
        id: string,
        subjectName: string,
        subjectCode: string
    }
}

export const useGetOnlineClass = ({
    options,
    id
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<TSingleOnlineClass>>
    id: string
}) => {
    const response = useFetchData<TSingleOnlineClass>({
        endpoint: QueryKey.ONLINE_CLASSES,
        queryKey: [QueryKey.ONLINE_CLASSES, id],
        id,
        options,
    })

    return response;
}