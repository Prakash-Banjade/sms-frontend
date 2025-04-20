import { createQueryString } from "@/utils/create-query-string";
import { useGetStudentLedger } from "../../data-access";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns";
import { EMonth } from "../fee-invoice/fee-invoice-form";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Printer } from "lucide-react";
import { useState } from "react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { DropdownMenu, DropdownMenuButtonItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import RePrintInvoice from "./re-print-invoice";
import RePrintPayment from "./re-print-payment";
import { ELedgerItemType, TLedger_FeeInvoice, TLedger_FeePayment } from "@/apps/admin/types/finance-system/fee-management.types";
import RePrintLibraryFinePayment from "./re-print-library-fine-payment";
import RefreshBtn from "../refresh-btn";
import { DateRangeFilter } from "@/components/search-components/date-range-filter";
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
                    <DateRangeFilter />
                </section>

                <section className="flex flex-col gap-2 items-end">
                    <div>Current Due: <strong>Rs. {(data?.ledgerAmount ?? 0)?.toLocaleString()}</strong></div>
                    <RefreshBtn refetch={refetch} isRefetching={isRefetching} />
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
                        <TableHead>Remark</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.data?.map((item, index) => {
                        const feeInvoice = typeof item.feeInvoice === 'string' ? JSON.parse(item.feeInvoice) as TLedger_FeeInvoice : item.feeInvoice;
                        const feePayment = typeof item.feePayment === 'string' ? JSON.parse(item.feePayment) as TLedger_FeePayment : item.feePayment;

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
                                <TableCell>{item.remark}</TableCell>
                                <TableCell>
                                    <LedgerActionColumn feeInvoice={feeInvoice} feePayment={feePayment} type={item.type} />
                                </TableCell>
                            </TableRow>
                        )
                    })}
                    {
                        data?.data?.length === 0 && <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-10">No ledger items found.</TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>

            {data?.meta && <DataTablePagination meta={data?.meta} />}

        </section>

    )
}

function LedgerActionColumn({
    feeInvoice,
    feePayment,
    type
}: {
    feeInvoice: TLedger_FeeInvoice | null,
    feePayment: TLedger_FeePayment | null,
    type: ELedgerItemType
}) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return <>
        <ResponsiveDialog
            isOpen={isDialogOpen}
            setIsOpen={setIsDialogOpen}
            title="Print Invoice"
            className="max-w-max"
        >
            {
                !!feeInvoice && type === ELedgerItemType.Invoice ? (
                    <RePrintInvoice invoiceId={feeInvoice.id} />
                ) : !!feePayment && type === ELedgerItemType.Payment ? (
                    <RePrintPayment paymentId={feePayment?.id} />
                ) : !!feePayment && type === ELedgerItemType.LibraryFine && (
                    <RePrintLibraryFinePayment paymentId={feePayment?.id} />
                )
            }
        </ResponsiveDialog>
        {/* library fine invoice is not printable */}
        {
            !(!!feeInvoice && type === ELedgerItemType.LibraryFine) && <DropdownMenu>
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
        }
    </>
}