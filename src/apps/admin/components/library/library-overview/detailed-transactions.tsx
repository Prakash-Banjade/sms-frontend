import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { useGetBookTransactions } from "../actions"
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

const nonResetFilters = ['take', 'page', 'search']

export default function DetailedLibraryBookTransactions() {
    const { searchParams, setSearchParams } = useCustomSearchParams()
    const [searchFilters, setSearchFilters] = useState({
        status: searchParams.get('status') ?? undefined,
        date: searchParams.get('date') ?? undefined,
    })

    const { data, isLoading } = useGetBookTransactions({
        queryString: createQueryString({
            take: searchParams.get('take'),
            page: searchParams.get('page'),
            search: searchParams.get('search'),
            status: searchParams.get('status'),
            date: searchParams.get('date'),
        }),
    });

    const handleSearchFiltersChange = (value: string | undefined, key: keyof typeof searchFilters) => {
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
                            <SelectTrigger className="w-[180px]" value={searchFilters.status}>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    Object.entries(EBookTransactionStatus).map(([key, value]) => (
                                        <SelectItem key={key} value={value}>
                                            {key}
                                        </SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                        <Select
                            onValueChange={val => handleSearchFiltersChange(val, 'date')}
                            value={searchFilters.date}
                        >
                            <SelectTrigger className="w-[180px]" value={searchFilters.date}>
                                <SelectValue placeholder="Filter by date" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="thisWeek">This Week</SelectItem>
                                <SelectItem value="thisMonth">This Month</SelectItem>
                                <SelectItem value="lastMonth">Last Month</SelectItem>
                            </SelectContent>
                        </Select>
                        {searchParams.size > 0 && !Array.from(searchParams.entries()).every(([key, _]) => nonResetFilters.includes(key)) && (
                            <Button
                                variant='ghost'
                                onClick={() => {
                                    handleSearchFiltersChange(undefined, 'status')
                                    handleSearchFiltersChange(undefined, 'date')
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
                        <TableHeadings headings={['S.N', 'Book Code', 'Book Name', 'Student Name', 'Student ID', 'Class', 'Issue Date', 'Due Date', 'Return Date', 'Status']} />
                    </TableHeader>
                    <TableBody>
                        {data?.data?.map((transaction, index) => (
                            <TableRow key={transaction.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{transaction.bookCode}</TableCell>
                                <TableCell>{transaction.bookName}</TableCell>
                                <TableCell>{transaction.studentName}</TableCell>
                                <TableCell>{transaction.studentId}</TableCell>
                                <TableCell>{transaction.parentClassName ?? transaction.classRoomName}</TableCell>
                                <TableCell>{formatDate({ date: new Date(transaction.createdAt) })}</TableCell>
                                <TableCell>{formatDate({ date: new Date(transaction.dueDate) })}</TableCell>
                                <TableCell>{transaction.returnedAt || '-'}</TableCell>
                                <TableCell>
                                    <Badge variant={transaction.returnedAt ? 'success' : 'warning'} className="text-sm">
                                        {transaction.returnedAt ? 'Returned' : 'Issued'}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                        {
                            data?.data?.length === 0 && <TableRow>
                                <TableCell colSpan={10} className="h-24 text-center">
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