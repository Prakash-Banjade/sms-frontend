import { createQueryString } from "@/utils/create-query-string";
import { useGetStudentLedger } from "../../../data-access";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { format } from "date-fns";
import { EMonth } from "../fee-invoice/fee-invoice-form";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { StudentLedgerFilters } from "./student-ledger-filters";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
type Props = {
    studentId: string;
}

export default function StudentLedgerView({ studentId }: Props) {
    const { searchParams } = useCustomSearchParams();

    const { data, isLoading } = useGetStudentLedger({
        queryString: createQueryString({
            studentId,
            dateFrom: searchParams.get('dateFrom'),
            dateTo: searchParams.get('dateTo'),
        }),
        options: { enabled: !!studentId }
    });

    if (!studentId) return null;

    if (isLoading) return <div>Loading...</div>;

    return (
        <section className="space-y-4 mt-10">
            <header className="flex justify-between items-center gap-10">
                <section>
                    <StudentLedgerFilters />
                </section>

                <section className="text-right">
                    <span>Previous Due: <strong>Rs. {data?.ledgerAmount?.toLocaleString()}</strong></span>
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
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.data?.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{format(new Date(item.date), 'dd/MM/yyyy')}</TableCell>
                            <TableCell>
                                {Object.entries(EMonth).find(([_, monthInd]) => +item.month === +monthInd)?.[0]}
                            </TableCell>
                            <TableCell>
                                {item.feeInvoiceId ? 'Invoice' : 'Payment'}
                            </TableCell>
                            <TableCell>
                                {item.invoiceNo || '-'}
                            </TableCell>
                            <TableCell>Rs. {item.totalAmount.toLocaleString()}</TableCell>
                            <TableCell>Rs. {item.ledgerAmount.toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
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