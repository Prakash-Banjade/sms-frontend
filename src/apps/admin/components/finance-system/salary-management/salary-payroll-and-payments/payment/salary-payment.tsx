import { TLastPayroll } from '@/types/finance-system/salary-management.types';
import { useGetLastPayroll } from '../../data-access';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import AppForm from '@/components/forms/app-form';
import { z } from 'zod';
import { EPaymentMethod } from '@/types/global.type';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppMutation } from '@/hooks/useAppMutation';
import { QueryKey } from '@/react-query/queryKeys';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import LoadingButton from '@/components/forms/loading-button';
import { startOfDayString } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';

export default function SalaryPayment({ employeeId }: { employeeId: string }) {
    const { data, isLoading } = useGetLastPayroll({
        id: employeeId,
        options: {
            enabled: !!employeeId,
        },
    });

    if (isLoading) return <div>Loading...</div>;

    if (!data || (data?.netSalary === data?.paidSalary)) return <div className="text-muted-foreground my-20 text-center">Nothing to pay!</div>;

    return (
        <SalaryPaymentForm payroll={data} />
    )
}

// Salary payment form begins here ----->

const paymentSchema = z.object({
    employeeId: z.string().uuid(),
    amount: z.coerce.number().nonnegative({ message: 'Amount must be a positive number' }).min(1, { message: 'Amount must be greater than 0' }),
    remark: z.string(),
    paymentMethod: z.nativeEnum(EPaymentMethod, { message: 'Payment method is required' }),
    paymentDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
});

export type paymentSchemaType = z.infer<typeof paymentSchema>;

function SalaryPaymentForm({ payroll }: { payroll: TLastPayroll }) {
    const queryclient = useQueryClient();

    const formDefaultValues = {
        employeeId: payroll?.employee?.id,
        amount: 0,
        remark: '',
        paymentMethod: EPaymentMethod.CASH,
        paymentDate: startOfDayString(new Date()),
    }

    const form = useForm<paymentSchemaType>({
        resolver: zodResolver(paymentSchema),
        defaultValues: formDefaultValues,
    })

    const { mutateAsync, isPending } = useAppMutation<paymentSchemaType, { message: string }>();

    async function onSubmit(values: paymentSchemaType) {
        const res = await mutateAsync({
            endpoint: QueryKey.SALARY_PAYMENTS,
            method: 'post',
            data: values,
            invalidateTags: [QueryKey.PAYROLLS, 'employees', values.employeeId]
        });

        console.log(payroll?.employee?.employeeId?.toString())

        console.log(res)

        if (res.data?.message) {
            console.log('submitted')
            queryclient.invalidateQueries({
                queryKey: [QueryKey.PAYROLLS, 'employees', payroll?.employee?.employeeId?.toString()],
            });

            form.reset(formDefaultValues);
        }
    }

    if (!payroll) return null;

    return (
        <Form {...form}>
            <form className="mt-6 space-y-6" onSubmit={form.handleSubmit(onSubmit)} aria-disabled={isPending}>
                <section className='flex justify-between items-center'>
                    <div className='space-y-2'>
                        <span>Salary Month: </span>
                        <strong>{format(payroll.date, 'MMMM yyyy')}</strong>
                    </div>
                    <div>
                        <AppForm.DatePicker<paymentSchemaType>
                            name='paymentDate'
                            label='Payment Date'
                        />
                    </div>
                </section>

                <section className='max-w-screen-sm mx-auto'>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Net Salary</TableCell>
                                <TableCell className="text-right font-semibold">
                                    Rs. {payroll.netSalary?.toLocaleString()}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Total Payment Made</TableCell>
                                <TableCell className="text-right font-semibold">
                                    Rs. {payroll.paidSalary?.toLocaleString()}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Amount</TableCell>
                                <TableCell className="flex justify-end font-semibold">
                                    <AppForm.Number<paymentSchemaType>
                                        name='amount'
                                        placeholder='eg. 1000'
                                        min={0}
                                        max={payroll.netSalary - payroll.paidSalary}
                                        inputClassName='w-fit'
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Remark</TableCell>
                                <TableCell className="flex justify-end font-semibold">
                                    <AppForm.Text<paymentSchemaType>
                                        name='remark'
                                        placeholder='Any remark?'
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Remaining Salary</TableCell>
                                <TableCell className="text-right font-semibold">
                                    Rs. {(payroll.netSalary - payroll.paidSalary - +(form.watch('amount') ?? 0))?.toLocaleString()}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Payment Method</TableCell>
                                <TableCell className="flex justify-end">
                                    <FormField
                                        control={form.control}
                                        name="paymentMethod"
                                        render={({ field }) => (
                                            <FormItem className="w-40" aria-disabled={isPending}>
                                                <Select onValueChange={field.onChange} value={field.value} disabled={isPending}>
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
                </section>

                <section className="flex justify-center mt-10">
                    <LoadingButton
                        isLoading={isPending}
                        loadingText='Submitting...'
                        type="submit"
                        disabled={isPending}
                    >
                        Submit Payment
                    </LoadingButton>
                </section>
            </form>
        </Form>
    )
}