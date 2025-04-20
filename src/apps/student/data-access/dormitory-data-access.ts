import { useFetchData } from "@/hooks/useFetchData";
import { QueryKey } from "@/react-query/queryKeys";
import { UseQueryOptions } from "@tanstack/react-query";

export type TMyDormitoryRoom = {
    id: string
    roomNumber: number,
    noOfBeds: number,
    costPerBed: number,
    students: {
        id: string,
        firstName: string,
        lastName: string,
        classRoom: {
            id: string,
            fullName: string
        }
    }[],
    dormitory: {
        id: string,
        name: string
    },
    roomType: {
        id: string,
        name: string
    }
}

export const useGetMyDormitoryRoom = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TMyDormitoryRoom>
}) => {
    const response = useFetchData<TMyDormitoryRoom>({
        endpoint: QueryKey.DORMITORY_ROOMS + '/me',
        queryKey: queryString ? [QueryKey.DORMITORY_ROOMS, 'me', queryString] : [QueryKey.DORMITORY_ROOMS, 'me'],
        queryString,
        options,
    })

    return response;
}