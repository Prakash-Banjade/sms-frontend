import { TFeeStudent } from "@/types/finance-system/fee-management.types";
import { useGetUnpaidBookTransactions } from "../../../../library/actions";
import { createQueryString } from "@/utils/create-query-string";
import { differenceInDays, startOfDay } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/utils/format-date";
import { useMemo, useRef, useState } from "react";
import { toWords } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Banknote, Printer } from "lucide-react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { useReactToPrint } from "react-to-print";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LibraryFineReceiptTemplate } from "./library-fine-receipt-template";
import LoadingButton from "@/components/forms/loading-button";
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { z } from "zod";
import { EPaymentMethod } from "@/types/global.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RefreshBtn from "../refresh-btn";

type Props = {
    feeStudent: TFeeStudent['student'];
}

const libraryFinePaymentSchema = z.object({
    studentId: z.string().uuid(),
    paymentMethod: z.nativeEnum(EPaymentMethod, { message: 'Payment method is required' }),
})

export type libraryFinePaymentSchemaType = z.infer<typeof libraryFinePaymentSchema>;

export default function LibraryFinePayment({ feeStudent }: Props) {
    const [receiptNo, setReceiptNo] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const receiptTemplateRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({ contentRef: receiptTemplateRef });

    const { data, isLoading, refetch, isRefetching } = useGetUnpaidBookTransactions({
        queryString: createQueryString({
            studentId: feeStudent.id,
        })
    });

    const grandTotal = useMemo(() => {
        return (data?.reduce((acc, item) => {
            if (!item.fine) return acc;

            const total = +item.fine;
            return acc + total;
        }, 0) || 0);
    }, [data]);

    const form = useForm<libraryFinePaymentSchemaType>({
        resolver: zodResolver(libraryFinePaymentSchema),
        defaultValues: {
            studentId: feeStudent.id,
            paymentMethod: EPaymentMethod.CASH
        },
    });

    const { mutateAsync, isPending } = useAppMutation<libraryFinePaymentSchemaType, { receiptNo: string }>();

    const onSubmit = async (values: libraryFinePaymentSchemaType) => {
        if (receiptNo) return; // don't perform submission until there is receipt no

        const res = await mutateAsync({
            method: "post",
            endpoint: QueryKey.FEE_PAYMENTS + '/library-fine',
            data: values,
            invalidateTags: [QueryKey.STUDENT_LEDGERS]
        });

        if (res.data?.receiptNo) {
            setReceiptNo(res.data.receiptNo);
        }
    }

    if (isLoading) return <div>Loading...</div>;

    if (!data?.length) return <div className="h-[400px] grid place-items-center text-muted-foreground">No unpaid transactions found or the book is not returned.</div>;

    return (
        <section className="mt-6">
            <header className="flex justify-end">
                <RefreshBtn
                    refetch={refetch}
                    isRefetching={isRefetching}
                    onRefetch={() => {
                        setReceiptNo(null)
                        form.reset()
                    }}
                />
            </header>

            <Form {...form}>
                <form className="mt-5" onSubmit={form.handleSubmit(onSubmit)} aria-disabled={isPending}>
                    <Table>
                        <TableHeader>
                            <TableRow className='bg-tableheader/50'>
                                <TableHead>S.N</TableHead>
                                <TableHead>Book Name</TableHead>
                                <TableHead>Issued Date</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Returned Date</TableHead>
                                <TableHead>Overdue days</TableHead>
                                <TableHead>Fine</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.map((transaction, ind) => {
                                const overDueDays = differenceInDays(startOfDay(new Date(transaction.returnedAt)), startOfDay(new Date(transaction.dueDate)));

                                return (
                                    <TableRow key={transaction.id}>
                                        <TableCell>{ind + 1}</TableCell>
                                        <TableCell>{transaction.bookName}</TableCell>
                                        <TableCell>{formatDate({ date: new Date(transaction.createdAt) })}</TableCell>
                                        <TableCell>{formatDate({ date: new Date(transaction.dueDate) })}</TableCell>
                                        <TableCell>{formatDate({ date: new Date(transaction.returnedAt) })}</TableCell>
                                        <TableCell>{overDueDays}</TableCell>
                                        <TableCell>Rs. {transaction.fine?.toLocaleString()}</TableCell>
                                    </TableRow>
                                )
                            })}

                            <TableRow className="hover:bg-transparent border-none">
                                <TableCell colSpan={6} className="text-right">
                                    Total Amount:
                                </TableCell>
                                <TableCell>Rs. {grandTotal.toLocaleString()}</TableCell>
                            </TableRow>

                            <TableRow className="hover:bg-transparent border-none">
                                <TableCell colSpan={6} className="text-right">
                                    Received Amount:
                                </TableCell>
                                <TableCell>Rs. {grandTotal.toLocaleString()}</TableCell>
                            </TableRow>

                            <TableRow className="hover:bg-transparent border-none">
                                <TableCell colSpan={6} className="text-right">Payment Method:</TableCell>
                                <TableCell className="py-2 pr-4">
                                    <FormField
                                        control={form.control}
                                        name="paymentMethod"
                                        render={({ field }) => (
                                            <FormItem className="w-[250px]" aria-disabled={isPending}>
                                                <Select onValueChange={field.onChange} value={field.value} disabled={isPending || !!receiptNo}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select payment method" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value={EPaymentMethod.CASH}>Cash</SelectItem>
                                                        <SelectItem value={EPaymentMethod.CHEQUE}>Cheque</SelectItem>
                                                        <SelectItem value={EPaymentMethod.BANK}>Bank</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>
                            </TableRow>

                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={7}>
                                    Amount in words:&nbsp;
                                    <span className="font-medium">
                                        {toWords.convert(grandTotal, { currency: true, ignoreZeroCurrency: true })}
                                    </span>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <section className="flex justify-center mt-10">
                        <ResponsiveDialog
                            isOpen={isDialogOpen}
                            setIsOpen={setIsDialogOpen}
                            title="Review Invoice"
                            className="max-w-max"
                        >
                            <ScrollArea className="max-h-[85vh] overflow-auto">
                                <LibraryFineReceiptTemplate
                                    ref={receiptTemplateRef}
                                    student={feeStudent}
                                    transactions={data?.map(t => ({
                                        fine: t.fine,
                                        bookName: t.bookName,
                                        overdueDays: differenceInDays(startOfDay(new Date(t.returnedAt)), startOfDay(new Date(t.dueDate))),
                                    }))}
                                    receipt={{
                                        receiptNo: receiptNo,
                                        paymentDate: new Date().toISOString(),
                                        paymentMethod: form.getValues('paymentMethod'),
                                        remark: '',
                                    }}
                                />
                                <div className="fixed left-1/2 top-[95%] -translate-x-1/2 -translate-y-1/2 z-10">
                                    {
                                        !receiptNo ? (
                                            <LoadingButton
                                                isLoading={isPending}
                                                disabled={isPending}
                                                loadingText="Submitting..."
                                                type="submit"
                                                className="bg-black text-white hover:bg-black/85"
                                                onClick={form.handleSubmit(onSubmit)}
                                            >
                                                <Banknote />
                                                Receive Fine
                                            </LoadingButton>
                                        ) : (
                                            <Button
                                                type="button"
                                                className="bg-black text-white hover:bg-black/85"
                                                onClick={() => handlePrint()}
                                            >
                                                <Printer />
                                                Print
                                            </Button>
                                        )
                                    }
                                </div>
                            </ScrollArea>
                        </ResponsiveDialog>
                        <Button onClick={() => setIsDialogOpen(true)} type="button" disabled={isPending}>
                            {
                                !receiptNo ? <>
                                    Continue <ArrowRight />
                                </> : <>
                                    <Printer /> Print
                                </>
                            }
                        </Button>
                    </section>
                </form>
            </Form>
        </section>
    )
}