import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TBookCategoryesResponse } from "@/types/library-book.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetBookCategories = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TBookCategoryesResponse>
}) => {
    const response = useFetchData<TBookCategoryesResponse>({
        endpoint: QueryKey.BOOK_CATEGORIES,
        queryKey: queryString ? [QueryKey.BOOK_CATEGORIES, queryString] : [QueryKey.BOOK_CATEGORIES],
        queryString,
        options,
    })

    return response;
}