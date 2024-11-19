import { useFetchData } from "@/hooks/useFetchData";
import { QueryKey } from "@/react-query/queryKeys";
import { UseQueryOptions } from "@tanstack/react-query";

export type TMyDormitory = {
    id: string
    roomNumber: number,
    noOfBeds: number,
    costPerBed: number,
    dormitoryName: string
    roomTypeName: string,
    roomMates: {
        id: string
        name: string
        classroomName: string
    }[]
}

export const useGetMyDormitory = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TMyDormitory>
}) => {
    const response = useFetchData<TMyDormitory>({
        endpoint: QueryKey.DORMITORY_ME,
        queryKey: queryString ? [QueryKey.DORMITORY_ME, queryString] : [QueryKey.DORMITORY_ME],
        queryString,
        options,
    })

    return response;
}