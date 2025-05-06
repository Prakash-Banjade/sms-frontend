import { useGetBookTransactions, useGetLibraryOverviewCount } from "@/apps/admin/components/library/data-access";
import { createQueryString } from "@/utils/create-query-string";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import ContainerLayout from "@/components/page-layouts/container-layout";
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/utils/format-date'
import { differenceInDays, format } from 'date-fns'
import { Banknote, Calendar, CheckCheck, Clock } from 'lucide-react'
import DashboardCountCard from "@/components/dashboard/dashboard-count-card"
import { TSt_TrasactionCount } from "@/apps/admin/types/library-book.type"
import { AlertTriangle, Book, BookOpen } from "lucide-react"
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EBookTransactionStatus } from "@/types/global.type";
import { useSearchParams } from "react-router-dom";

export default function StudentLibraryDetailsPage() {

    return (
        <ContainerLayout
            title="Library Overview"
            description="Your library book transactions and statistics."
        >
            <LibraryStatistics />
            <BookTransactions />
        </ContainerLayout>
    )
};

function LibraryStatistics() {
    const { data, isLoading } = useGetLibraryOverviewCount<TSt_TrasactionCount>()

    if (!data) null;

    return (
        <section className="@container">
            <div className="grid grid-cols-1 @md:grid-cols-2 @xl:grid-cols-3 gap-4">
                <DashboardCountCard title="Total Trasaction" count={data?.totalCount || 0} icon={BookOpen} isLoading={isLoading} />
                <DashboardCountCard title="Borrowed" count={data?.issuedCount || 0} icon={Book} isLoading={isLoading} />
                <DashboardCountCard title="Overdue" count={data?.overdueCount || 0} icon={AlertTriangle} isLoading={isLoading} />
            </div>
        </section>
    )
};

function BookTransactions() {
    const { searchParams, setSearchParams } = useCustomSearchParams()
    const [searchFilters, setSearchFilters] = useState({
        status: searchParams.get('status') ?? '',
    })

    const handleSearchFiltersChange = (value: string, key: keyof typeof searchFilters) => {
        setSearchFilters({ ...searchFilters, [key]: value })
        setSearchParams(key, value)
    }

    return (
        <section className="@container mt-6">
            <header className="flex justify-between items-center gap-4">
                <h2 className="text-xl font-semibold mb-6">Library Transactions</h2>

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
                        <SelectItem value={EBookTransactionStatus.Overdue}>Overdue</SelectItem>
                    </SelectContent>
                </Select>
            </header>

            <BookTransactionsList />
        </section>
    )
}

function BookTransactionsList() {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetBookTransactions({
        queryString: createQueryString({
            status: searchParams.get('status'),
            page: searchParams.get('page'),
            take: searchParams.get('take'),
        })
    });

    if (isLoading) return <div> Loading...</div>;

    if (!data || data?.data?.length === 0) return (
        <div className="mt-20 text-center text-muted-foreground">
            No library record available!!
        </div>
    )

    return (
        <>
            <div className="grid @xl:grid-cols-2 @3xl:grid-cols-3 @6xl:grid-cols-4 gap-6">
                {data?.data.map((transaction) => {
                    const isOverDue = differenceInDays(new Date(transaction.dueDate), new Date()) < 0 && !transaction.returnedAt;

                    return (
                        <Card key={transaction.id} className="flex flex-col gap-3 h-full">
                            <CardHeader className="pb-2 flex   flex-row justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg text-wrap">{transaction.bookName}</CardTitle>
                                    <p className='text-sm text-muted-foreground'>{transaction.bookCode}</p>
                                </div>
                                <Badge variant={isOverDue ? 'destructiveOutline' : transaction.returnedAt ? 'success' : 'info'} className="text-sm h-fit">
                                    {isOverDue ? 'Overdue' : transaction.returnedAt ? 'Returned' : 'Issued'}
                                </Badge>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">Borrowed : {formatDate({ date: new Date(transaction.createdAt) })}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">Due : {formatDate({ date: new Date(transaction.dueDate) })}</span>
                                    </div>
                                    {
                                        transaction.fine > 0 && (
                                            <div className='flex items-center'>
                                                <Banknote className="mr-2 h-4 w-4 text-muted-foreground" />
                                                <span className='text-sm'>Fine : {transaction.fine}</span>
                                            </div>
                                        )
                                    }
                                    {
                                        transaction.paidAt && (
                                            <div className='flex items-center'>
                                                <CheckCheck className="mr-2 h-4 w-4 text-muted-foreground" />
                                                <span className='text-sm'>Paid At : {format(transaction.paidAt, "dd/MM/yyyy")}</span>
                                            </div>
                                        )
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {
                data?.meta?.hasNextPage && (
                    <DataTablePagination meta={data?.meta} />
                )
            }
        </>
    )
}