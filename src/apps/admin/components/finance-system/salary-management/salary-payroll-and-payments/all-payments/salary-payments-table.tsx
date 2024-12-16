import { createQueryString } from "@/utils/create-query-string";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { useGetSalaryPayments } from "../../data-access";
import { DateRangeFilter } from "../../../../../../../components/search-components/date-range-filter";
import { DropdownMenu, DropdownMenuButtonItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Printer } from "lucide-react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { useState } from "react";
import SalaryPaySlipTemplate from "../payment/salary-payslip-template";

type Props = {
    employeeId: string;
}

export default function SalaryPaymentsTable({ employeeId }: Props) {
    const { searchParams } = useCustomSearchParams();

    const { data, isLoading } = useGetSalaryPayments({
        queryString: createQueryString({
            employeeId,
            dateFrom: searchParams.get('dateFrom'),
            dateTo: searchParams.get('dateTo'),
            page: searchParams.get('page'),
            take: searchParams.get('take'),
        }),
        options: { enabled: !!employeeId }
    });

    if (!employeeId) return null;

    if (isLoading) return <div>Loading...</div>;

    return (
        <section className="space-y-4 mt-10">
            <header className="flex justify-between items-end gap-10">
                <DateRangeFilter />
            </header>

            <Table>
                <TableHeader className="bg-tableheader">
                    <TableRow>
                        <TableHead>Payment Date</TableHead>
                        <TableHead>Payment Method</TableHead>
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
                                <TableCell>Rs. {item.amount?.toLocaleString()}</TableCell>
                                <TableCell>{item.remark}</TableCell>
                                {
                                    index === 0 && <TableCell>
                                        <SalaryPaymentActionColumn item={item} />
                                    </TableCell>
                                }
                            </TableRow>
                        )
                    })}
                    {
                        data?.data?.length === 0 && <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-10">No payments found.</TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>

            {data?.meta && <DataTablePagination meta={data?.meta} />}
        </section>
    )
}

function SalaryPaymentActionColumn({ item }: { item: any }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    console.log(item)

    return (
        <>
            <ResponsiveDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                title="Print Payslip"
                className="max-w-max"
            >
                <SalaryPaySlipTemplate />
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