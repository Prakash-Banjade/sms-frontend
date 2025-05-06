import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useGetBookTransactions } from "../data-access";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/format-date";
import TableHeadings from "@/components/data-table/table-headings";
import { isBefore, startOfDay } from "date-fns";

export default function RecentLibraryBookTransactions() {
    const { data, isLoading } = useGetBookTransactions({});

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
                        {data?.data?.slice(0, 5).map((transaction: any) => { // we are slicing the data but not using take=5 in query because it would make two queries to the backend due to the transaction query in detailed transaction section
                            const isOverDue = isBefore(startOfDay(new Date(transaction.dueDate)), startOfDay(new Date())) && !transaction.returnedAt;

                            return (
                                <TableRow key={transaction.id}>
                                    <TableCell>{transaction.bookName}</TableCell>
                                    <TableCell>{transaction.studentName}</TableCell>
                                    <TableCell>
                                        {
                                            transaction.parentClassName
                                                ? transaction.parentClassName + ' - ' + transaction.classRoomName
                                                : transaction.classRoomName
                                        }
                                    </TableCell>
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