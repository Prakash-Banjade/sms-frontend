import React from 'react';
import { BookOpen } from 'lucide-react';
import { TLibraryBook } from '@/apps/admin/types/library-book.type';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import ImageWithPlaceholder from '@/components/image-with-placeholder';
import { getImageUrl } from '@/lib/utils';

interface BookCardProps {
    book: TLibraryBook;
    index: number;
}

export default function BookCard({ book }: BookCardProps) {
    // Calculate a random height between 180px and 320px for visual variety
    const randomHeight = React.useMemo(() => {
        return Math.floor(Math.random() * (320 - 180) + 180);
    }, []);

    return (
        <Card className="group relative flex h-fit flex-col overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div
                className="relative overflow-hidden"
                style={{
                    height: book.coverImage ? 'auto' : `${randomHeight}px`,
                    minHeight: '180px',
                    backgroundColor: book.coverImage ? 'transparent' : '#f3f4f6'
                }}
            >
                <Link to={book.id}>
                    {book.coverImage ? (
                        <ImageWithPlaceholder
                            alt={book.bookName}
                            src={book.coverImage?.url || "/lib_book_placeholder.png"}
                            placeholderSrc={getImageUrl(book.coverImage?.url, "q=2&w=50")}
                            className="object-contain w-full object-center transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-foreground/80 to-foreground">
                            <BookOpen size={48} className="text-muted-foreground" />
                        </div>
                    )}
                </Link>
            </div>

            <div className="flex flex-1 flex-col">
                <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-lg font-semibold leading-tight line-clamp-2">
                        <Link to={book.id} className='hover:underline'>
                            {book.bookName}
                        </Link>
                    </CardTitle>
                    {book.publisherName && (
                        <p className="text-sm text-muted-foreground">
                            {book.publisherName}
                        </p>
                    )}
                </CardHeader>

                {book.description && (
                    <CardContent className="p-4 pt-2">
                        <p className="text-sm text-accent-foreground line-clamp-3">
                            {book.description}
                        </p>
                    </CardContent>
                )}

                {book.publicationYear && (
                    <CardFooter className="mt-auto p-4 pt-3">
                        <div className="flex items-center w-full gap-4 text-xs">
                            <span className="text-accent-foreground">
                                {book.publicationYear}
                            </span>
                            <span className="text-accent-foreground">
                                {book.bookCode}
                            </span>
                            <Badge className='ml-auto'>{book.category.name}</Badge>
                        </div>
                    </CardFooter>
                )}
            </div>
        </Card>
    );
};