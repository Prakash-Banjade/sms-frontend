import { createQueryString } from "@/utils/create-query-string";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { useGetSalaryPayments } from "../../data-access";
import { DropdownMenu, DropdownMenuButtonItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Printer } from "lucide-react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-provider";
import { isAdmin } from "@/lib/utils";
import { Role } from "@/types/global.type";
import { TSalaryPaymentResponse } from "@/apps/admin/types/finance-system/salary-management.types";
import { SalaryPayslipTemplate } from "../payment/salary-payslip-template";
import PrintPaySlip from "../payment/print-payment";

type Props = {
    employeeId?: string;
}

export default function SalaryPaymentsTable({ employeeId }: Props) {
    const { searchParams } = useCustomSearchParams();
    const { payload } = useAuth();

    const { data, isLoading } = useGetSalaryPayments({
        queryString: createQueryString({
            employeeId,
            dateFrom: searchParams.get('dateFrom'),
            dateTo: searchParams.get('dateTo'),
            page: searchParams.get('page'),
            take: searchParams.get('take'),
        }),
        options: { enabled: (!!employeeId && isAdmin(payload)) || payload?.role === Role.TEACHER }
    });

    if (!employeeId && isAdmin(payload)) return null;

    if (isLoading) return <div className="p-6 text-muted-foreground">Loading...</div>;

    if (!data) return null;

    return (
        <>
            <Table>
                <TableHeader className="bg-tableheader">
                    <TableRow>
                        <TableHead>Payment Date</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Salary Month</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Remark</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.data?.map((item, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell>{format(new Date(item.paymentDate), 'dd/MM/yyyy')}</TableCell>
                                <TableCell className="capitalize">{item.paymentMethod}</TableCell>
                                <TableCell>{format(new Date(item.salaryDate), 'MMM yyyy')}</TableCell>
                                <TableCell>Rs. {item.amount?.toLocaleString()}</TableCell>
                                <TableCell>{item.remark || '-'}</TableCell>
                                <TableCell>
                                    <SalaryPaymentActionColumn payment={item} />
                                </TableCell>
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

function SalaryPaymentActionColumn({ payment }: { payment: TSalaryPaymentResponse["data"][0] }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <>
            <ResponsiveDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                title="Print Payslip"
                className="max-w-max"
            >
                <PrintPaySlip payment={payment} />
            </ResponsiveDialog>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuButtonItem onClick={() => setIsDialogOpen(true)}>
                        <Printer /> Print
                    </DropdownMenuButtonItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}