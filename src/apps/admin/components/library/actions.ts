import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TLibraryBook, TLibraryBookesResponse, TLibraryBookTransactionsResponse } from "@/types/library-book.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetLibraryBook = ({
    id,
    queryString,
    options,
}: {
    id: string;
    queryString?: string;
    options?: UseQueryOptions<TLibraryBook>
}) => {
    const response = useFetchData<TLibraryBook>({
        queryKey: [QueryKey.LIBRARY_BOOKS, id],
        endpoint: QueryKey.LIBRARY_BOOKS,
        id,
        queryString,
        options,
    })

    return response;
}

export const useGetLibraryBookes = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TLibraryBookesResponse>
}) => {
    const response = useFetchData<TLibraryBookesResponse>({
        endpoint: QueryKey.LIBRARY_BOOKS,
        queryKey: queryString ? [QueryKey.LIBRARY_BOOKS, queryString] : [QueryKey.LIBRARY_BOOKS],
        queryString,
        options,
    })

    return response;
}

export const useGetBookTransactions = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TLibraryBookTransactionsResponse>
}) => {
    const response = useFetchData<TLibraryBookTransactionsResponse>({
        endpoint: QueryKey.BOOK_TRANSACTIONS,
        queryKey: queryString ? [QueryKey.BOOK_TRANSACTIONS, queryString] : [QueryKey.BOOK_TRANSACTIONS],
        queryString,
        options,
    })

    return response;
}