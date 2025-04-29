import { useGetSalaryPayrolls } from '@/apps/admin/components/finance-system/salary-management/data-access';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { DateRangeFilter } from '@/components/search-components/date-range-filter'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createQueryString } from '@/utils/create-query-string';
import { format } from 'date-fns';
import { useSearchParams } from 'react-router-dom';

type Props = {}

export default function SalaryPayrollsTable({ }: Props) {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetSalaryPayrolls({
        queryString: createQueryString({
            page: searchParams.get('page'),
            take: searchParams.get('take'),
            dateFrom: searchParams.get('dateFrom'),
            dateTo: searchParams.get('dateTo'),
        })
    });

    if (!data) return null;

    return (
        <section className="space-y-4 mt-10">
            <header className="flex justify-between items-end gap-10">
                <DateRangeFilter />
            </header>

            {
                isLoading
                    ? <div>Loading...</div>
                    : (
                        <>
                            <Table>
                                <TableHeader className="bg-tableheader">
                                    <TableRow>
                                        <TableHead>Payroll Date</TableHead>
                                        <TableHead>Gross Salary</TableHead>
                                        <TableHead>Net Salary</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data?.data?.map((item, index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{format(new Date(item.date), 'dd/MM/yyyy')}</TableCell>
                                                <TableCell>Rs. {item.grossSalary?.toLocaleString()}</TableCell>
                                                <TableCell>Rs. {item.netSalary?.toLocaleString()}</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        )
                                    })}
                                    {
                                        data?.data?.length === 0 && <TableRow className="hover:bg-transparent">
                                            <TableCell colSpan={5} className="text-center text-muted-foreground py-10">No payments found.</TableCell>
                                        </TableRow>
                                    }
                                </TableBody>
                            </Table>

                            <DataTablePagination meta={data?.meta} />
                        </>
                    )
            }
        </section>
    )
}