import React from 'react';
import Masonry from 'react-masonry-css';
import { useInView } from 'react-intersection-observer';
import { BookOpen, RefreshCw, Search } from 'lucide-react';
import { useInfiniteBooks } from '../../data-access/library-book-data-access';
import BookSkeleton from '../../components/library-books/books-loading-skeleton';
import BookCard from '../../components/library-books/book-card';
import { Button } from '@/components/ui/button';
import ContainerLayout from '@/components/page-layouts/container-layout';
import { Input } from '@/components/ui/input';
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
import { createQueryString } from '@/utils/create-query-string';

export function LibraryBooksPage() {
    const { searchParams } = useCustomSearchParams();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        error,
        refetch,
    } = useInfiniteBooks({
        queryString: createQueryString({
            search: searchParams.get('search'),
        })
    });

    const { ref: innerRef, inView } = useInView({
        threshold: 0.5,
    });

    // Fetch next page when the last element comes into view
    React.useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Configure the breakpoints for the masonry grid
    const breakpointColumns = {
        default: 4,
        1100: 3,
        768: 2,
        500: 1
    };

    const renderBooks = () => {
        if (status === 'pending') {
            return (
                <Masonry
                    breakpointCols={breakpointColumns}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                >
                    {Array.from({ length: 12 }).map((_, index) => (
                        <BookSkeleton key={index} />
                    ))}
                </Masonry>
            );
        }

        if (status === 'error') {
            return (
                <div className="flex h-64 flex-col items-center justify-center text-center">
                    <div className="mb-4 rounded-full bg-secondary p-3">
                        <BookOpen size={32} />
                    </div>
                    <h3 className="mb-2 text-lg font-medium">Error loading books</h3>
                    <p className="mb-4 max-w-md text-muted-foreground">
                        {error instanceof Error ? error.message : 'An unknown error occurred'}
                    </p>
                    <Button
                        onClick={() => refetch()}
                        type="button"
                    >
                        <RefreshCw />
                        Try Again
                    </Button>
                </div>
            );
        }

        if (data?.pages.flatMap(page => page.data.data).length === 0) {
            return (
                <div className="flex h-64 flex-col items-center justify-center text-center">
                    <div className="mb-4 rounded-full bg-secondary p-3">
                        <BookOpen size={32} />
                    </div>
                    <h3 className="mb-2 text-lg font-medium">No books found</h3>
                    <p className="mb-4 max-w-md text-muted-foreground">
                        We couldn't find any books matching your search. Try a different query.
                    </p>
                </div>
            );
        }

        return (
            <>
                <Masonry
                    breakpointCols={breakpointColumns}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                >
                    {data?.pages.flatMap(page => page.data.data).map((book, index) => (
                        <BookCard key={book.id} book={book} index={index} />
                    ))}
                </Masonry>

                {/* Loading more indicator */}
                <div ref={innerRef} className="mt-8">
                    {isFetchingNextPage && (
                        <div className="flex justify-center">
                            <div className="flex items-center gap-2">
                                <RefreshCw size={20} className="animate-spin text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Loading more books...</span>
                            </div>
                        </div>
                    )}
                </div>
            </>
        );
    };

    return (
        <ContainerLayout
            title='E-Library'
            description="Access digital version of library books"
        >
            <SearchInputForm />

            {
                !!data?.totalItems && (
                    <section className='text-center text-sm text-muted-foreground'>
                        Found {data?.totalItems?.toLocaleString()} book(s)
                        {
                            !!searchParams.get('search') && (
                                <>
                                    {' '}
                                    for "{searchParams.get('search')}"
                                </>
                            )
                        }
                    </section>
                )
            }

            {renderBooks()}
        </ContainerLayout>
    );
};

function SearchInputForm() {
    const { searchParams, setSearchParams } = useCustomSearchParams();

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();

        setSearchParams('search', (e.target as HTMLFormElement).search.value);
    }

    return (
        <form onSubmit={handleSearch}>
            <section className='group relative flex items-center max-w-[800px] w-[90%] mx-auto focus-within:shadow-lg'>
                <Input
                    name='search'
                    type='search'
                    defaultValue={searchParams.get('search') ?? ''}
                    className='rounded-full p-6 pl-12'
                    placeholder='Search books, authors, category...'
                />
                <div className='absolute left-5 text-muted-foreground group-focus-within:text-foreground'>
                    <Search size={20} />
                </div>
                <div className='absolute right-0'>
                    <Button type='submit' className='font-semibold py-6 rounded-r-full rounded-l-none'>
                        Search
                    </Button>
                </div>
            </section>
        </form>
    )
}