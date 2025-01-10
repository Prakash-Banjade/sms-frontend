import { QueryKey } from "@/react-query/queryKeys";
import { useFetchData } from "./useFetchData";

export const useFacultySearch = <T>(queryString?: string) => {
    const { data, isLoading } = useFetchData<T[]>({
        endpoint: QueryKey.FACULTIES + '/' + QueryKey.OPTIONS,
        queryKey: [QueryKey.FACULTIES, QueryKey.OPTIONS],
        queryString,
        options: {
            staleTime: Infinity,
            gcTime: Infinity,
        }
    });

    return { data, isLoading };
}