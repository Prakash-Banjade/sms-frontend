import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { TLibraryBook, TLibraryBookesResponse } from '@/apps/admin/types/library-book.type';
import { useAxios } from '@/services/api';
import { QueryKey } from '@/react-query/queryKeys';

interface UseInfiniteBooksParams {
    queryString?: string
}

export const useInfiniteBooks = ({
    queryString,
}: UseInfiniteBooksParams = {}) => {
    const axios = useAxios();

    return useInfiniteQuery({
        queryKey: queryString ? [QueryKey.LIBRARY_BOOKS, queryString] : [QueryKey.LIBRARY_BOOKS],
        queryFn: ({ pageParam = 1 }) => axios.get<TLibraryBookesResponse>(`${QueryKey.LIBRARY_BOOKS}?${queryString}`, {
            params: {
                page: pageParam,
                take: 25,
            }
        }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage.data.meta.hasNextPage ? lastPage.data.meta.page + 1 : undefined;
        },
        select: (data) => {
            const allBooks: TLibraryBook[] = [];
            data.pages.forEach(page => {
                if (page.data) {
                    allBooks.push(...page.data.data);
                }
            });
            return {
                pages: data.pages,
                pageParams: data.pageParams,
                allBooks,
                totalItems: data.pages[0]?.data.meta.itemCount || 0,
            };
        },
        placeholderData: keepPreviousData,
    });
};