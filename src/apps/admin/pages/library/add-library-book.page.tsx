import LibraryBookForm from '../../components/library/library-book.form'
import ContainerLayout from '@/components/aside-layout.tsx/container-layout'
import { useGetLibraryBookes } from '../../components/library/actions';
import { createQueryString } from '@/utils/create-query-string';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AddLibraryBookPage() {

    return (
        <ContainerLayout
            title="Add Library Book"
            description="Add a new library book to your library."
        >
            <Card className='pt-6'>
                <CardContent>
                    <LibraryBookForm />
                </CardContent>
            </Card>

            <section className="mt-8">
                <RecentlyAddedBooks />
            </section>

        </ContainerLayout>
    )
}

export const RecentlyAddedBooks = () => {
    const { data, isLoading } = useGetLibraryBookes({
        queryString: createQueryString({
            take: 5,
        })
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <Card className='space-y-6'>
            <CardHeader>
                <h3 className='text-lg font-bold'>Recently Added Books</h3>
            </CardHeader>

            <CardContent>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>S.N</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Publisher</TableHead>
                            <TableHead>Publication Year</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.data?.map((book, index) => (
                            <TableRow key={book.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{book.bookCode}</TableCell>
                                <TableCell>{book.bookName}</TableCell>
                                <TableCell>{book.category?.name}</TableCell>
                                <TableCell>{book.publisherName || 'N/A'}</TableCell>
                                <TableCell>{book.publicationYear}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>

        </Card>
    )
}