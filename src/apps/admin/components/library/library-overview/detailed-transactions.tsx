import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { useGetBookTransactions } from "../data-access"
import { createQueryString } from "@/utils/create-query-string"
import { formatDate } from "@/utils/format-date"
import { Badge } from "@/components/ui/badge"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { EBookTransactionStatus } from "@/types/global.type"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import TableHeadings from "@/components/data-table/table-headings"
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams"
import { useState } from "react"
import SearchInput from "@/components/search-components/search-input"
import { differenceInDays, isBefore, startOfDay } from "date-fns"

const nonResetFilters = ['take', 'page', 'search']

export default function DetailedLibraryBookTransactions() {
    const { searchParams, setSearchParams } = useCustomSearchParams()
    const [searchFilters, setSearchFilters] = useState({
        status: searchParams.get('status') ?? '',
        period: searchParams.get('period') ?? '',
        paid: searchParams.get('paid') ?? '',
    })

    const { data, isLoading } = useGetBookTransactions({
        queryString: createQueryString({
            take: searchParams.get('take'),
            page: searchParams.get('page'),
            search: searchParams.get('search'),
            status: searchParams.get('status'),
            period: searchParams.get('period'),
            paid: searchParams.get('paid'),
        }),
    });

    const handleSearchFiltersChange = (value: string, key: keyof typeof searchFilters) => {
        setSearchFilters({ ...searchFilters, [key]: value })
        setSearchParams(key, value)
    }

    if (isLoading) return <div>Loading...</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Detailed Transactions</CardTitle>
                <CardDescription>Manage book issues, returns, and view history</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center my-4">
                    <div className="flex items-center space-x-2">
                        <SearchInput placeholder="Search book code or studentID..." className="w-64" />
                        <Select
                            onValueChange={val => handleSearchFiltersChange(val, 'status')}
                            value={searchFilters.status}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={EBookTransactionStatus.Issued}>Issued</SelectItem>
                                <SelectItem value={EBookTransactionStatus.Returned}>Returned</SelectItem>
                                <SelectItem value="paid">Overdue <span className="text-xs text-muted-foreground">(Paid)</span></SelectItem>
                                <SelectItem value="unpaid">Overdue <span className="text-xs text-muted-foreground">(Unpaid)</span></SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            onValueChange={val => handleSearchFiltersChange(val, 'period')}
                            value={searchFilters.period}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="last_week">Last Week</SelectItem>
                                <SelectItem value="this_month">This Month</SelectItem>
                                <SelectItem value="last_month">Last Month</SelectItem>
                            </SelectContent>
                        </Select>
                        {searchParams.size > 0 && !Array.from(searchParams.entries()).every(([key, _]) => nonResetFilters.includes(key)) && (
                            <Button
                                variant='ghost'
                                onClick={() => {
                                    setSearchFilters({ status: '', period: '', paid: '' })
                                    setSearchParams('status', '')
                                    setSearchParams('period', '')
                                }}
                                className='h-8 px-2 lg:px-3'
                            >
                                Reset
                                <X className='ml-2 h-4 w-4' />
                            </Button>
                        )}
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableHeadings headings={['S.N', 'Book Code', 'Book Name', 'Member Name', 'Member ID', 'Issue Date', 'Due Date', 'Returned At', 'Renewals', 'Status', 'Overdue days', 'Fine', 'Paid At']} />
                    </TableHeader>
                    <TableBody>
                        {data?.data?.map((transaction, index) => {
                            const isOverDue = isBefore(startOfDay(new Date(transaction.dueDate)), startOfDay(new Date())) && !transaction.returnedAt;
                            const overDueDays = !transaction.returnedAt
                                ? differenceInDays(startOfDay(new Date()), startOfDay(new Date(transaction.dueDate)))
                                : differenceInDays(startOfDay(transaction.returnedAt), startOfDay(new Date(transaction.dueDate)))

                            return (
                                <TableRow key={transaction.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{transaction.bookCode}</TableCell>
                                    <TableCell>{transaction.bookName}</TableCell>
                                    <TableCell className="capitalize">{transaction.memberName}</TableCell>
                                    <TableCell>{transaction.memberId}</TableCell>
                                    <TableCell>{formatDate({ date: new Date(transaction.createdAt) })}</TableCell>
                                    <TableCell>{formatDate({ date: new Date(transaction.dueDate) })}</TableCell>
                                    <TableCell>{transaction.returnedAt ? formatDate({ date: new Date(transaction.returnedAt) }) : '-'}</TableCell>
                                    <TableCell>{transaction.renewals?.split(',').filter(renewal => renewal !== '').length}</TableCell>
                                    <TableCell>
                                        <Badge variant={isOverDue ? 'destructiveOutline' : transaction.returnedAt ? 'success' : 'info'} className="text-sm">
                                            {isOverDue ? 'Overdue' : transaction.returnedAt ? 'Returned' : 'Issued'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{(overDueDays > 0) ? `${overDueDays} days` : '-'}</TableCell>
                                    <TableCell>Rs. {transaction.fine?.toLocaleString()}</TableCell>
                                    <TableCell>{transaction.paidAt ? formatDate({ date: new Date(transaction.paidAt) }) : '-'}</TableCell>
                                </TableRow>
                            )
                        })}
                        {
                            data?.data?.length === 0 && <TableRow>
                                <TableCell colSpan={14} className="h-24 text-center text-muted-foreground">
                                    No results found.
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
                <div className="h-10"></div>
                {data?.meta && <DataTablePagination meta={data?.meta} />}
            </CardContent>
        </Card>
    )
}