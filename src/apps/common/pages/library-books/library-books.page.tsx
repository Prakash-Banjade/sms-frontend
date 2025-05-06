import React from 'react';
import Masonry from 'react-masonry-css';
import { useInView } from 'react-intersection-observer';
import { BookOpen, RefreshCw } from 'lucide-react';
import { useInfiniteBooks } from '../../data-access/library-book-data-access';
import BookSkeleton from '../../components/library-books/books-loading-skeleton';
import BookCard from '../../components/library-books/book-card';

export function LibraryBooksPage() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        error,
        refetch,
    } = useInfiniteBooks({
        queryString: ""
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
                    <div className="mb-4 rounded-full bg-red-100 p-3">
                        <BookOpen size={32} className="text-red-500" />
                    </div>
                    <h3 className="mb-2 text-lg font-medium text-slate-800">Error loading books</h3>
                    <p className="mb-4 max-w-md text-slate-600">
                        {error instanceof Error ? error.message : 'An unknown error occurred'}
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        <RefreshCw size={16} />
                        Try Again
                    </button>
                </div>
            );
        }

        if (data?.pages.length === 0) {
            return (
                <div className="flex h-64 flex-col items-center justify-center text-center">
                    <div className="mb-4 rounded-full bg-slate-100 p-3">
                        <BookOpen size={32} className="text-slate-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-medium text-slate-800">No books found</h3>
                    <p className="mb-4 max-w-md text-slate-600">
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
                    {data?.pages.flatMap(page => page.data).map((book, index) => (
                        <BookCard key={book.id} book={book} index={index} />
                    ))}
                </Masonry>

                {/* Loading more indicator */}
                <div ref={innerRef} className="mt-8">
                    {isFetchingNextPage && (
                        <div className="flex justify-center">
                            <div className="flex items-center gap-2">
                                <RefreshCw size={20} className="animate-spin text-indigo-600" />
                                <span className="text-sm text-slate-600">Loading more books...</span>
                            </div>
                        </div>
                    )}
                </div>
            </>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {renderBooks()}
        </div>
    );
};