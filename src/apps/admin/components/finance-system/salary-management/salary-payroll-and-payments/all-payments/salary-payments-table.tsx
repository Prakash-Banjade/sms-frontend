import { createQueryString } from "@/utils/create-query-string";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { useGetSalaryPayments } from "../../data-access";
import { DateRangeFilter } from "../../../../../../../components/search-components/date-range-filter";

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
                <section>
                    <DateRangeFilter />
                </section>

                {/* <section className="flex flex-col gap-2 items-end">
                    <div>Current Due: <strong>Rs. {(data?.ledgerAmount ?? 0)?.toLocaleString()}</strong></div>
                    <RefreshBtn refetch={refetch} isRefetching={isRefetching} />
                </section> */}
            </header>

            <Table>
                <TableHeader className="bg-tableheader">
                    <TableRow>
                        <TableHead>Payment Date</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Remark</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.data?.map((item, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell>{format(new Date(item.paymentDate), 'dd/MM/yyyy')}</TableCell>
                                <TableCell>{item.paymentMethod}</TableCell>
                                <TableCell>Rs. {item.amount?.toLocaleString()}</TableCell>
                                <TableCell>{item.remark}</TableCell>
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