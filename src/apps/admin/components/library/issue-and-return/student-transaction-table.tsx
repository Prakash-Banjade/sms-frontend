import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGetStudentTransactions } from "../actions"
import { createQueryString } from "@/utils/create-query-string"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import TableHeadings from "@/components/data-table/table-headings"
import { formatDate } from "@/utils/format-date"
import { differenceInDays, startOfDay } from "date-fns"
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams"
import { Badge } from "@/components/ui/badge"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { Library_CurrentIssueTable } from "./current-issues-table"
import { TStudentTransaction } from "@/types/library-book.type"

type Props = {
    selectedTransactions: TStudentTransaction[];
    setSelectedTransactions: React.Dispatch<React.SetStateAction<TStudentTransaction[]>>;
}

export default function Library_StudentTransactionTable({ selectedTransactions, setSelectedTransactions }: Props) {
    return (
        <Card>
            <CardContent className="p-6">
                <Tabs defaultValue="current-issues" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="current-issues">Current Issues</TabsTrigger>
                        <TabsTrigger value="all-history">All History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="current-issues">
                        <Library_CurrentIssueTable selectedTransactions={selectedTransactions} setSelectedTransactions={setSelectedTransactions} />
                    </TabsContent>
                    <TabsContent value="all-history">
                        <AllHistoryTable />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

function AllHistoryTable() {
    const { searchParams } = useCustomSearchParams()

    const { data, isLoading } = useGetStudentTransactions({
        queryString: createQueryString({
            studentId: searchParams.get('studentID'),
            page: searchParams.get('page'),
            take: searchParams.get('take'),
        }),
    });

    if (isLoading) return <div>Loading...</div>;
    if (!data) return <div>No transactions found</div>;

    return (
        <>
            <Table>
                <TableHeader>
                    <TableHeadings headings={['Book Code', 'Title', 'Issued At', 'Due At', 'Returned At', 'Overdue Days', 'Fine', 'Renewals', 'Status']} />
                </TableHeader>
                <TableBody>
                    {data?.data?.map((transaction) => {
                        const renewals = transaction.renewals?.split(',').filter(renewal => renewal !== '');

                        return (
                            <TableRow key={transaction.id}>
                                <TableCell>{transaction.bookCode}</TableCell>
                                <TableCell>{transaction.bookName}</TableCell>
                                <TableCell>{formatDate({ date: new Date(transaction.createdAt) })}</TableCell>
                                <TableCell>{formatDate({ date: new Date(transaction.dueDate) })}</TableCell>
                                <TableCell>{
                                    transaction.returnedAt ? formatDate({ date: new Date(transaction.returnedAt) }) : '-'
                                }</TableCell>
                                <TableCell>{Math.abs(differenceInDays(startOfDay(new Date(transaction.dueDate)), startOfDay(new Date())))} days</TableCell>
                                <TableCell>{transaction.fine?.toLocaleString()}</TableCell>
                                <TableCell>{renewals?.length}</TableCell>
                                <TableCell>
                                    <Badge variant={transaction.returnedAt ? 'success' : 'warning'} className="text-sm">
                                        {transaction.returnedAt ? 'Returned' : 'Issued'}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                    {
                        data?.data?.length === 0 && <TableRow>
                            <TableCell colSpan={9} className="h-24 text-center">
                                No results found.
                            </TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>
            <div className="h-10"></div>
            <DataTablePagination meta={data.meta} />
        </>
    )
}