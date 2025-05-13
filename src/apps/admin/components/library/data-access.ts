import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TLibraryBook, TLibraryBookesResponse, TLibraryBookTransactionsResponse, TLibraryOverviewCount, TStudentTransactionsResponse, TUnpaidTransaction } from "@/apps/admin/types/library-book.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetLibraryBook = ({
    id,
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

export const useGetStudentTransactions = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TStudentTransactionsResponse>
}) => {
    const response = useFetchData<TStudentTransactionsResponse>({
        endpoint: QueryKey.BOOK_TRANSACTIONS + '/member',
        queryKey: queryString ? [QueryKey.BOOK_TRANSACTIONS, 'member', queryString] : [QueryKey.BOOK_TRANSACTIONS, 'member'],
        queryString,
        options,
    })

    return response;
}

export const useGetLibraryOverviewCount = <T = TLibraryOverviewCount>() => {
    const response = useFetchData<T>({
        endpoint: QueryKey.LIBRARY_BOOKS + '/count',
        queryKey: [QueryKey.LIBRARY_BOOKS, 'count'],
    })

    return response;
}


export const useGetUnpaidBookTransactions = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<TUnpaidTransaction[]>>
}) => {
    const response = useFetchData<TUnpaidTransaction[]>({
        queryKey: queryString ? [QueryKey.BOOK_TRANSACTIONS, 'unpaid', queryString] : [QueryKey.BOOK_TRANSACTIONS, 'unpaid'],
        endpoint: QueryKey.BOOK_TRANSACTIONS + '/unpaid',
        queryString,
        options,
    })

    return response;
}