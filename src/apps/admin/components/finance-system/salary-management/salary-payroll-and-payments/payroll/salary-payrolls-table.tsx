import { useGetSalaryPayrolls } from '@/apps/admin/components/finance-system/salary-management/data-access';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createQueryString } from '@/utils/create-query-string';
import { format } from 'date-fns';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DropdownMenu, DropdownMenuButtonItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import PrintPayroll from './print-payroll';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { MoreHorizontal, Printer } from 'lucide-react';

export default function SalaryPayrollsTable() {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetSalaryPayrolls({
        queryString: createQueryString({
            employeeId: searchParams.get('employeeID'),
            page: searchParams.get('page'),
            take: searchParams.get('take'),
            dateFrom: searchParams.get('dateFrom'),
            dateTo: searchParams.get('dateTo'),
        })
    });

    if (isLoading) return <div className='p-6 text-muted-foreground'>Loading...</div>;

    if (!data) return null;

    return (
        <>
            <Table>
                <TableHeader className="bg-tableheader">
                    <TableRow>
                        <TableHead>Payroll Date</TableHead>
                        <TableHead>Basic Salary</TableHead>
                        <TableHead>Net Salary</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.data?.map((item, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell>{format(new Date(item.date), 'dd/MM/yyyy')}</TableCell>
                                <TableCell>Rs. {item.basicSalary?.toLocaleString()}</TableCell>
                                <TableCell>Rs. {item.netSalary?.toLocaleString()}</TableCell>
                                <TableCell>
                                    <TableAction id={item.id} />
                                </TableCell>
                            </TableRow>
                        )
                    })}
                    {
                        data?.data?.length === 0 && <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-10">No payroll found.</TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>

            <DataTablePagination meta={data?.meta} />
        </>
    )
}

function TableAction({ id }: { id: string }) {
    const [isPrintOpen, setIsPrintOpen] = useState(false);

    return <>
        <ResponsiveDialog
            isOpen={isPrintOpen}
            setIsOpen={setIsPrintOpen}
            title="Print Payroll"
            className="max-w-max"
        >
            <PrintPayroll id={id} />
        </ResponsiveDialog>

        {
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuButtonItem onClick={() => setIsPrintOpen(true)}>
                        <Printer />
                        <span>Print</span>
                    </DropdownMenuButtonItem>
                    {/* <DropdownMenuButtonItem onClick={() => setIsPrintOpen(true)}>
                        <Download />
                        <span>Download</span>
                    </DropdownMenuButtonItem> */}
                </DropdownMenuContent>
            </DropdownMenu>
        }
    </>
}