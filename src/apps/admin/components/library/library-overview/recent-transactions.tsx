import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useGetBookTransactions } from "../actions";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/format-date";
import TableHeadings from "@/components/data-table/table-headings";
import { differenceInDays } from "date-fns";

export default function RecentLibraryBookTransactions() {
    const { data, isLoading } = useGetBookTransactions({
        queryString: 'take=5',
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Overview of the latest book transactions</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableHeadings headings={['Book', 'Student', 'Class', 'Date', 'Returned', 'Status']} />
                    </TableHeader>
                    <TableBody>
                        {data?.data?.map((transaction) => {
                            const isOverDue = differenceInDays(new Date(transaction.dueDate), new Date()) < 0 && !transaction.returnedAt;

                            return (
                                <TableRow key={transaction.id}>
                                    <TableCell>{transaction.bookName}</TableCell>
                                    <TableCell>{transaction.studentName}</TableCell>
                                    <TableCell>{transaction.parentClassName ?? transaction.classRoomName}</TableCell>
                                    <TableCell>{formatDate({ date: new Date(transaction.createdAt) })}</TableCell>
                                    <TableCell>{transaction.returnedAt ? formatDate({ date: new Date(transaction.returnedAt) }) : '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant={isOverDue ? 'destructiveOutline' : transaction.returnedAt ? 'success' : 'info'} className="text-sm">
                                            {isOverDue ? 'Overdue' : transaction.returnedAt ? 'Returned' : 'Issued'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        {
                            data?.data?.length === 0 && <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No results found.
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}