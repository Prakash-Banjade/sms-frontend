import { Input } from "@/components/ui/input";
import { useGetLastInvoice } from "../../data-access";
import { EMonth } from "../fee-invoice/fee-invoice-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { NUMBER_REGEX_STRING } from "@/CONSTANTS";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { EPaymentMethod } from "@/types/global.type";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import LoadingButton from "@/components/forms/loading-button";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useReactToPrint } from "react-to-print";
import { ArrowRight, Banknote, Printer, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReceiptTemplate } from "./fee-receipt-template";
import { TFeeStudent } from "@/types/finance-system/fee-management.types";
import { cn } from "@/lib/utils";

type Props = {
    feeStudent: TFeeStudent['student'];
}

const paymentSchema = z.object({
    feeInvoiceId: z.string().uuid(),
    paidAmount: z.coerce.number().nonnegative({ message: 'Amount must be a positive number' }).min(1, { message: 'Amount must be greater than 0' }),
    remark: z.string(),
    paymentMethod: z.nativeEnum(EPaymentMethod, { message: 'Payment method is required' }),
});
export type paymentSchemaType = z.infer<typeof paymentSchema>;
export default function FeePaymentForm({ feeStudent }: Props) {
    const [receiptNo, setReceiptNo] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const receiptTemplateRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({ contentRef: receiptTemplateRef });

    const { data, isLoading, refetch, isRefetching } = useGetLastInvoice({
        studentId: feeStudent.id,
        options: { enabled: !!feeStudent.id }
    });

    const form = useForm<paymentSchemaType>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            paidAmount: 0,
            feeInvoiceId: undefined,
            remark: '',
            paymentMethod: EPaymentMethod.CASH
        },
    });

    useEffect(() => { // reset the feeInvoiceId
        if (data?.id) form.setValue('feeInvoiceId', data.id);
    }, [data])

    const { mutateAsync, isPending } = useAppMutation<paymentSchemaType, { receiptNo: string }>();

    async function onSubmit(values: paymentSchemaType) {
        if (receiptNo) return; // don't perform submission until there is receipt no

        const response = await mutateAsync({
            method: "post",
            endpoint: QueryKey.FEE_PAYMENTS,
            data: values,
            invalidateTags: [QueryKey.STUDENT_LEDGERS],
        });

        if (response?.data?.receiptNo) {
            setReceiptNo(response.data.receiptNo);
        }
    }

    if (isLoading) return <div>Loading...</div>;

    if (!data) return <div className="h-[400px] grid place-items-center text-muted-foreground">No payment is due.</div>;

    return (
        <section className="mt-6">
            <header className="flex justify-between gap-10">
                <section>
                    Month Upto: <strong>{Object.entries(EMonth).find(([_, monthInd]) => +monthInd === +data.month)?.[0]}</strong>
                </section>

                <section>
                    <Button
                        onClick={() => {
                            refetch()
                            setReceiptNo(null)
                            form.reset()
                        }}
                        type="button"
                        size={'sm'}
                        variant={'outline'}
                        disabled={isRefetching}
                    >

                        <RefreshCcw className={cn(isRefetching && 'animate-spin')} />
                        Refresh
                    </Button>
                </section>
            </header>

            <Form {...form}>
                <form className="mt-5" onSubmit={form.handleSubmit(onSubmit)} aria-disabled={isPending}>
                    <Table>
                        <TableHeader>
                            <TableRow className='bg-tableheader/50'>
                                <TableHead className="w-20">S.N</TableHead>
                                <TableHead>Charge Head</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead className="w-40">Discount (%)</TableHead>
                                <TableHead className="min-w-[100px]">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                data?.items?.map((item, index) => (
                                    <TableRow key={item.id} className="'border-b'">
                                        <TableCell>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>
                                            {item.chargeHead?.name}
                                        </TableCell>
                                        <TableCell>
                                            {item.amount?.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            {item.discount} %
                                        </TableCell>
                                        <TableCell>
                                            {
                                                (item.amount - (item.amount * (item.discount ?? 0) / 100))?.toLocaleString()
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                            {
                                (data?.ledgerItem?.ledgerAmount - data.totalAmount) > 0 && <TableRow>
                                    <TableCell>
                                        {data?.items?.length + 1}
                                    </TableCell>
                                    <TableCell>Previous Due</TableCell>
                                    <TableCell>{(data?.ledgerItem?.ledgerAmount - data.totalAmount)?.toLocaleString()}</TableCell>
                                    <TableCell>-</TableCell>
                                    <TableCell colSpan={2}>{(data?.ledgerItem?.ledgerAmount - data.totalAmount)?.toLocaleString()}</TableCell>
                                </TableRow>
                            }
                            <TableRow className="hover:bg-transparent border-none">
                                <TableCell colSpan={4} className="text-right">
                                    Total Amount:
                                </TableCell>
                                <TableCell>
                                    {
                                        (data?.ledgerItem?.ledgerAmount)?.toLocaleString()
                                    }
                                </TableCell>
                            </TableRow>
                            {
                                data?.totalFeesPaid !== null && (
                                    <TableRow className="hover:bg-transparent border-none">
                                        <TableCell colSpan={4} className="text-right">
                                            Prior Payments:
                                        </TableCell>
                                        <TableCell>{data.totalFeesPaid?.toLocaleString()}</TableCell>
                                    </TableRow>
                                )
                            }
                            <TableRow className="hover:bg-transparent border-none">
                                <TableCell colSpan={4} className="text-right">
                                    Outstanding Balance:
                                </TableCell>
                                <TableCell colSpan={2} className="max-w-40">
                                    {
                                        (data?.ledgerItem?.studentLedger?.amount)?.toLocaleString()
                                    }
                                </TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-transparent border-none">
                                <TableCell colSpan={4} className="text-right py-1">
                                    Received Amount:
                                </TableCell>
                                <TableCell colSpan={2} className="max-w-40 py-1">
                                    <FormField
                                        control={form.control}
                                        name="paidAmount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        pattern={NUMBER_REGEX_STRING}
                                                        min={1}
                                                        max={data?.ledgerItem?.studentLedger?.amount}
                                                        required className="max-w-[200px]"
                                                        {...field}
                                                        disabled={isPending || !!receiptNo}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-transparent border-none">
                                <TableCell colSpan={4} className="text-right">
                                    Remaining Due:
                                </TableCell>
                                <TableCell colSpan={2} className="max-w-40">
                                    {
                                        (data?.ledgerItem?.studentLedger?.amount - form.watch('paidAmount'))?.toLocaleString()
                                    }
                                </TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-transparent border-none">
                                <TableCell colSpan={3} className="max-w-40 py-1">
                                    <FormField
                                        control={form.control}
                                        name="remark"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Any remark?"
                                                        className="max-w-[400px]"
                                                        {...field}
                                                        disabled={isPending}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>
                                <TableCell className="text-right">Payment Method:</TableCell>
                                <TableCell className="max-w-40 py-1">
                                    <FormField
                                        control={form.control}
                                        name="paymentMethod"
                                        render={({ field }) => (
                                            <FormItem className="max-w-[250px]" aria-disabled={isPending}>
                                                <Select onValueChange={field.onChange} disabled={isPending || !!receiptNo}>
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
                                <ReceiptTemplate
                                    ref={receiptTemplateRef}
                                    student={{
                                        ...feeStudent,
                                        previousDue: (data?.ledgerItem?.ledgerAmount - data.totalAmount)
                                    }}
                                    invoice={{
                                        month: data.month?.toString(),
                                        totalAmount: data?.ledgerItem.ledgerAmount, // this is the amount including the previous due
                                        invoiceItems: data.items?.map(item => ({
                                            amount: item.amount,
                                            chargeHead: item.chargeHead?.name,
                                            discount: item.discount,
                                        })) ?? [],
                                        totalFeesPaid: data?.totalFeesPaid,
                                    }}
                                    receipt={{
                                        paidAmount: form.getValues('paidAmount'),
                                        paymentDate: new Date().toISOString(),
                                        receiptNo: receiptNo,
                                        paymentMethod: form.getValues('paymentMethod'),
                                        remark: form.getValues('remark'),
                                        outStandingBalance: data?.ledgerItem?.studentLedger?.amount
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
                                                onClick={form.handleSubmit(onSubmit)}
                                                className="bg-black text-white hover:bg-black/85"
                                            >
                                                <Banknote />
                                                Submit Payment
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
                        <Button onClick={() => setIsDialogOpen(true)} type="button" disabled={Object.keys(form.formState.errors).length > 0 || !form.formState.isValid}>
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