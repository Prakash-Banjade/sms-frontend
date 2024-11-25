import { createQueryString } from "@/utils/create-query-string";
import { useGetStudentLedger } from "../../../data-access";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns";
import { EMonth } from "../fee-invoice/fee-invoice-form";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { StudentLedgerFilters } from "./student-ledger-filters";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Printer, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { DropdownMenu, DropdownMenuButtonItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import RePrintInvoice from "./re-print-invoice";
import RePrintPayment from "./re-print-payment";
type Props = {
    studentId: string;
}

export default function StudentLedgerView({ studentId }: Props) {
    const { searchParams } = useCustomSearchParams();

    const { data, isLoading, refetch, isRefetching } = useGetStudentLedger({
        queryString: createQueryString({
            studentId,
            dateFrom: searchParams.get('dateFrom'),
            dateTo: searchParams.get('dateTo'),
            page: searchParams.get('page'),
            take: searchParams.get('take'),
        }),
        options: { enabled: !!studentId }
    });

    if (!studentId) return null;

    if (isLoading) return <div>Loading...</div>;

    return (
        <section className="space-y-4 mt-10">
            <header className="flex justify-between items-end gap-10">
                <section>
                    <StudentLedgerFilters />
                </section>

                <section className="flex flex-col gap-2">
                    <div>Current Due: <strong>Rs. {data?.ledgerAmount?.toLocaleString()}</strong></div>
                    <Button
                        type="button"
                        variant={'outline'}
                        size={'sm'}
                        onClick={() => refetch()}
                        className="ml-auto"
                        disabled={isRefetching}
                    >
                        <RefreshCcw className={cn(isRefetching && 'animate-spin')} />
                        Refresh
                    </Button>
                </section>
            </header>

            <Table>
                <TableHeader className="bg-tableheader">
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Month Upto</TableHead>
                        <TableHead>Particular</TableHead>
                        <TableHead>Rcv.No</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.data?.map((item, index) => {
                        const feeInvoice = typeof item.feeInvoice === 'string' ? JSON.parse(item.feeInvoice) : item.feeInvoice;
                        const feePayment = typeof item.feePayment === 'string' ? JSON.parse(item.feePayment) : item.feePayment;

                        return (
                            <TableRow key={index}>
                                <TableCell>{format(new Date(item.date), 'dd/MM/yyyy')}</TableCell>
                                <TableCell>
                                    {
                                        feeInvoice?.month && Object.entries(EMonth).find(([_, monthInd]) => +feeInvoice.month === +monthInd)?.[0]
                                    }
                                </TableCell>
                                <TableCell>
                                    {!!feeInvoice?.id ? 'Invoice' : 'Payment'}
                                </TableCell>
                                <TableCell>
                                    {feeInvoice?.rcvNo || feePayment?.rcvNo || '-'}
                                </TableCell>
                                <TableCell>Rs. {(feePayment?.amount ?? feeInvoice?.amount)?.toLocaleString()}</TableCell>
                                <TableCell>Rs. {item.ledgerAmount?.toLocaleString()}</TableCell>
                                <TableCell>
                                    <LedgerActionColumn feeInvoice={feeInvoice} feePayment={feePayment} />
                                </TableCell>
                            </TableRow>
                        )
                    })}
                    {
                        data?.data?.length === 0 && <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-10">No ledger items found.</TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>

            {data?.meta && <DataTablePagination meta={data?.meta} />}

        </section>

    )
}

function LedgerActionColumn({ feeInvoice, feePayment }: { feeInvoice: any, feePayment: any }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return <>
        <ResponsiveDialog
            isOpen={isDialogOpen}
            setIsOpen={setIsDialogOpen}
            title="Print Invoice"
            className="max-w-max"
        >
            {
                feeInvoice?.id ? (
                    <RePrintInvoice invoiceId={feeInvoice.id} />
                ) : (
                    <RePrintPayment paymentId={feePayment?.id} />
                )
            }
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
                    <Printer />
                    <span>Print</span>
                </DropdownMenuButtonItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </>
}