import React from 'react';
import { BookOpen } from 'lucide-react';
import { TLibraryBook } from '@/apps/admin/types/library-book.type';

interface BookCardProps {
    book: TLibraryBook;
    index: number;
}

export default function BookCard({ book }: BookCardProps) {
    const imageUrl = book.coverImage?.url || 'https://via.placeholder.com/128x192/e2e8f0/1e293b?text=No+Cover';

    // Calculate a random height between 180px and 320px for visual variety
    const randomHeight = React.useMemo(() => {
        return Math.floor(Math.random() * (320 - 180) + 180);
    }, []);

    return (
        <div
            className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl"
        >
            <div
                className="relative overflow-hidden"
                style={{
                    height: book.coverImage ? 'auto' : `${randomHeight}px`,
                    minHeight: '180px',
                    backgroundColor: book.coverImage ? 'transparent' : '#f3f4f6'
                }}
            >
                {book.coverImage ? (
                    <img
                        src={imageUrl}
                        alt={book.bookName}
                        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                        <BookOpen size={48} className="text-slate-400" />
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col p-4">
                <h3 className="mb-1 font-serif text-lg font-semibold leading-tight text-slate-800 line-clamp-2">
                    {book.bookName}
                </h3>

                {book.publisherName && (
                    <p className="mb-2 text-sm text-slate-600">
                        {book.publisherName}
                    </p>
                )}

                {book.description && (
                    <p className="mt-2 text-sm text-slate-500 line-clamp-3">
                        {book.description}
                    </p>
                )}

                <div className="mt-auto flex items-center gap-4 pt-3 text-xs">
                    {book.publicationYear && (
                        <span className="text-slate-500">
                            {book.publicationYear}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};