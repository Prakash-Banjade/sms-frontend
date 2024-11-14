import { useFetchData } from "@/hooks/useFetchData";
import { QueryKey } from "@/react-query/queryKeys";
import { TOptionalSubject } from "@/types/subject.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetOptionalSubjects = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<TOptionalSubject[]>>
}) => {
    const response = useFetchData<TOptionalSubject[]>({
        endpoint: QueryKey.OPTIONAL_SUBJECTS,
        queryKey: queryString ? [QueryKey.OPTIONAL_SUBJECTS, queryString] : [QueryKey.OPTIONAL_SUBJECTS],
        queryString,
        options,
    })

    return response;
}