import { useFetchData } from "@/hooks/useFetchData";
import { QueryKey } from "@/react-query/queryKeys";
import { TSingleStudent } from "@/types/student.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetStudent_Me = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<TSingleStudent>>
}) => {
    const response = useFetchData<TSingleStudent>({
        endpoint: QueryKey.STUDENT_ME,
        queryKey: queryString ? [QueryKey.STUDENT_ME, queryString] : [QueryKey.STUDENT_ME],
        queryString,
        options,
    })

    return response;
}