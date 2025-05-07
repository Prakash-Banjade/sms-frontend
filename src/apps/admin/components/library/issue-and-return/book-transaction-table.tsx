import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGetStudentTransactions } from "../data-access"
import { createQueryString } from "@/utils/create-query-string"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import TableHeadings from "@/components/data-table/table-headings"
import { formatDate } from "@/utils/format-date"
import { differenceInDays, startOfDay } from "date-fns"
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams"
import { Badge } from "@/components/ui/badge"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { TStudentTransaction } from "@/apps/admin/types/library-book.type"
import { EBookTransactionStatus } from "@/types/global.type"
import { Checkbox } from "@/components/ui/checkbox"

type Props = {
    selectedTransactions: TStudentTransaction[];
    setSelectedTransactions: React.Dispatch<React.SetStateAction<TStudentTransaction[]>>;
}

export default function BookTransactionTables(props: Props) {
    return (
        <Card>
            <CardContent className="p-6">
                <Tabs defaultValue="current-issues" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="current-issues">Current Issues</TabsTrigger>
                        <TabsTrigger value="all-history">All History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="current-issues">
                        <CurrentIssueTable {...props} />
                    </TabsContent>
                    <TabsContent value="all-history">
                        <AllHistoryTable />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

export function CurrentIssueTable({ selectedTransactions, setSelectedTransactions }: Props) {
    const { searchParams } = useCustomSearchParams()

    const { data, isLoading } = useGetStudentTransactions({
        queryString: createQueryString({
            status: EBookTransactionStatus.Issued,
            skipPagination: true,
            teacherId: searchParams.get('teacherId'), // only one of teacherId or studentId will be set
            studentId: searchParams.get('studentId'),
        }),
    });

    const handleCheckboxChange = (bookId: string) => {
        const foundTransaction = data?.data.find(transaction => transaction.id === bookId);

        if (!foundTransaction) return;

        setSelectedTransactions(prev => prev.find(transaction => transaction.id === bookId)
            ? prev.filter(transaction => transaction.id !== bookId)
            : [...prev, foundTransaction]
        )
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked && data?.data?.length) {
            setSelectedTransactions(data.data)
        } else {
            setSelectedTransactions([])
        }
    }

    if (isLoading) return <div>Loading...</div>;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px]">
                        <Checkbox
                            checked={!!data?.data.length && (selectedTransactions.length === data.data.length)}
                            onCheckedChange={handleSelectAll}
                            aria-label="Select all"
                        />
                    </TableHead>
                    <TableHead>Book Code</TableHead>
                    <TableHead>Book Name</TableHead>
                    <TableHead>Issued Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Overdue Days</TableHead>
                    <TableHead className="w-20">Fine</TableHead>
                    <TableHead>Renewals</TableHead>
                    <TableHead>Last Renewal</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data?.data?.map((transaction) => {
                    const renewals = transaction.renewals?.split(',').filter(renewal => renewal !== '');
                    const overDueDays = differenceInDays(startOfDay(new Date()), startOfDay(new Date(transaction.dueDate)));

                    return (
                        <TableRow key={transaction.id}>
                            <TableCell>
                                <Checkbox
                                    checked={selectedTransactions.some(t => t.id === transaction.id)}
                                    onCheckedChange={() => handleCheckboxChange(transaction.id)}
                                    aria-label={`Select ${transaction.bookName}`}
                                />
                            </TableCell>
                            <TableCell>{transaction.bookCode}</TableCell>
                            <TableCell>{transaction.bookName}</TableCell>
                            <TableCell>{formatDate({ date: new Date(transaction.createdAt) })}</TableCell>
                            <TableCell>{formatDate({ date: new Date(transaction.dueDate) })}</TableCell>
                            <TableCell>{overDueDays > 0 ? `${overDueDays} days` : '-'}</TableCell>
                            <TableCell>Rs. {transaction.fine?.toLocaleString()}</TableCell>
                            <TableCell>{renewals?.length}</TableCell>
                            <TableCell>
                                {
                                    renewals?.length
                                        ? formatDate({ date: new Date(renewals[renewals.length - 1]) })
                                        : '-'
                                }
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
    )
}

function AllHistoryTable() {
    const { searchParams } = useCustomSearchParams()

    const { data, isLoading } = useGetStudentTransactions({
        queryString: createQueryString({
            teacherId: searchParams.get('teacherId'), // only one of teacherId or studentId will be set
            studentId: searchParams.get('studentId'),
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
                    <TableHeadings headings={['Book Code', 'Title', 'Issued At', 'Due Date', 'Returned At', 'Overdue Days', 'Fine', 'Renewals', 'Status']} />
                </TableHeader>
                <TableBody>
                    {data?.data?.map((transaction) => {
                        const renewals = transaction.renewals?.split(',').filter(renewal => renewal !== '');
                        const overDueDays = !transaction.returnedAt
                            ? differenceInDays(startOfDay(new Date()), startOfDay(new Date(transaction.dueDate)))
                            : differenceInDays(startOfDay(transaction.returnedAt), startOfDay(new Date(transaction.dueDate)))

                        return (
                            <TableRow key={transaction.id}>
                                <TableCell>{transaction.bookCode}</TableCell>
                                <TableCell>{transaction.bookName}</TableCell>
                                <TableCell>{formatDate({ date: new Date(transaction.createdAt) })}</TableCell>
                                <TableCell>{formatDate({ date: new Date(transaction.dueDate) })}</TableCell>
                                <TableCell>{
                                    transaction.returnedAt ? formatDate({ date: new Date(transaction.returnedAt) }) : '-'
                                }</TableCell>
                                <TableCell>{overDueDays > 0 ? `${overDueDays} days` : '-'}</TableCell>
                                <TableCell className="w-24">Rs. {transaction.fine?.toLocaleString()}</TableCell>
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