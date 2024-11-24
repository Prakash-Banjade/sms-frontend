import { Input } from "@/components/ui/input";
import { useGetLastInvoice } from "../../../data-access";
import { EMonth } from "../fee-invoice/fee-invoice-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { NUMBER_REGEX_STRING } from "@/CONSTANTS";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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

type Props = {
    studentId: string;
}

const paymentSchema = z.object({
    feeInvoiceId: z.string().uuid(),
    paidAmount: z.coerce.number().nonnegative({ message: 'Amount must be a positive number' }).min(1, { message: 'Amount must be greater than 0' }),
    remark: z.string(),
    paymentMethod: z.nativeEnum(EPaymentMethod, { message: 'Payment method is required' }),
});
type paymentSchemaType = z.infer<typeof paymentSchema>;
export default function FeePaymentForm({ studentId }: Props) {
    const { data, isLoading } = useGetLastInvoice({
        studentId,
        options: { enabled: !!studentId }
    });

    const form = useForm<paymentSchemaType>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            paidAmount: data?.studentLedger?.amount ?? 0,
            feeInvoiceId: undefined,
            remark: '',
            paymentMethod: undefined
        },
    });

    useEffect(() => { // reset the feeInvoiceId
        if (data?.id) form.setValue('feeInvoiceId', data.id);
    }, [data])

    const { mutateAsync, isPending } = useAppMutation<paymentSchemaType, any>();

    async function onSubmit(values: paymentSchemaType) {
        await mutateAsync({
            method: "post",
            endpoint: QueryKey.FEE_PAYMENTS,
            data: values,
            invalidateTags: [QueryKey.FEE_PAYMENTS],
        });
    }


    if (isLoading) return <div>Loading...</div>;

    if (!data) return <div className="h-[400px] grid place-items-center text-muted-foreground">No payment is due.</div>;

    return (
        <section className="mt-6">
            <div>
                Month Upto: <strong>{Object.entries(EMonth).find(([_, monthInd]) => +monthInd === +data.month)?.[0]}</strong>
            </div>

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
                                            {item.amount.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            {item.discount} %
                                        </TableCell>
                                        <TableCell>
                                            {
                                                (item.amount - (item.amount * (item.discount ?? 0) / 100)).toLocaleString()
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                            {
                                (data.studentLedger?.amount - data?.totalAmount) > 0 && <TableRow>
                                    <TableCell>
                                        {data?.items?.length + 1}
                                    </TableCell>
                                    <TableCell>Previous Due</TableCell>
                                    <TableCell>{(data.studentLedger?.amount - data?.totalAmount).toLocaleString()}</TableCell>
                                    <TableCell>-</TableCell>
                                    <TableCell colSpan={2}>{(data.studentLedger?.amount - data?.totalAmount).toLocaleString()}</TableCell>
                                </TableRow>
                            }
                            <TableRow className="hover:bg-transparent border-none">
                                <TableCell colSpan={4} className="text-right">
                                    Receivable Amount:
                                </TableCell>
                                <TableCell>
                                    {
                                        (data.studentLedger?.amount).toLocaleString()
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
                                                        max={data.studentLedger?.amount}
                                                        required className="max-w-[200px]"
                                                        {...field}
                                                        disabled={isPending}
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
                                        (data.studentLedger?.amount - form.watch('paidAmount')).toLocaleString()
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
                                                <Select onValueChange={field.onChange} disabled={isPending}>
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
                        <LoadingButton isLoading={isPending} disabled={isPending} loadingText="Submitting..." type="submit">
                            Submit Payment
                        </LoadingButton>
                    </section>
                </form>
            </Form>

        </section>
    )
}