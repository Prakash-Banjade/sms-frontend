import AppForm from "@/components/forms/app-form"
import { ESalaryAdjustmentType, TSalaryEmployee } from "@/apps/admin/types/finance-system/salary-management.types"
import { zodResolver } from "@hookform/resolvers/zod"
import { addMonths, format } from "date-fns"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn, startOfDayString } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useMemo } from "react"
import { Minus, Plus, TriangleAlert } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppMutation } from "@/hooks/useAppMutation"
import { QueryKey } from "@/react-query/queryKeys"
import { useQueryClient } from "@tanstack/react-query"
import LoadingButton from "@/components/forms/loading-button"
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams"
import PayrollPrintBtn from "./payroll-print-btn"

type Props = {
    salaryEmployee: TSalaryEmployee,
    defaultValues?: undefined
    payrollId?: undefined,
    paidSalary?: undefined,
} | {
    salaryEmployee: TSalaryEmployee,
    defaultValues: PayrollFormSchemaType
    payrollId: string,
    paidSalary?: number
}

const payrollSchema = z.object({
    employeeId: z.string({ required_error: 'Employee ID is required' }).uuid({ message: 'Employee ID must be a valid UUID' }),
    date: z.string({ required_error: 'Date is required' }).datetime({ message: 'A valid date is required' }),
    salaryAdjustments: z.array(z.object({
        amount: z.coerce.number().min(0, { message: 'Amount must be greater than 0' }),
        description: z.string({ required_error: 'Particular is required' })
            .min(1, { message: 'Particular is required' })
            .max(50, { message: 'Particular must be less than 50 characters' }),
        type: z.nativeEnum(ESalaryAdjustmentType, {
            errorMap: () => ({ message: 'Invalid salary adjustment type' })
        })
    })).optional(),
    advance: z.coerce.number().min(0, { message: 'Advance must be greater than 0' }),
});

type PayrollFormSchemaType = z.infer<typeof payrollSchema>;

export default function PayrollForm({ salaryEmployee, defaultValues, payrollId, paidSalary }: Props) {
    const queryClient = useQueryClient();
    const { searchParams, setSearchParams } = useCustomSearchParams();

    const formDefaultValues = useMemo(() => {
        return defaultValues ?? {
            employeeId: salaryEmployee.employee?.id,
            date: salaryEmployee.lastPayrollDate
                ? startOfDayString(addMonths(salaryEmployee.lastPayrollDate, 1))
                : startOfDayString(new Date()),
            salaryAdjustments: [],
            advance: 0,
        }
    }, [defaultValues, salaryEmployee])

    const form = useForm<PayrollFormSchemaType>({
        resolver: zodResolver(payrollSchema),
        defaultValues: formDefaultValues,
    });

    useEffect(() => {
        form.reset(defaultValues ?? formDefaultValues);
    }, [defaultValues])

    const totalAdjustments = useMemo(() => {
        return form.watch('salaryAdjustments')?.reduce((acc, curr) => {
            return curr.type === ESalaryAdjustmentType.Deduction ? acc - +curr.amount : acc + +curr.amount;
        }, 0) ?? 0;
    }, [form.watch()]);

    const totalEarnings = (salaryEmployee.grossSalary + (salaryEmployee.employee?.payAmount ?? 0) - (salaryEmployee?.lastAdvanceAmount ?? 0));

    const { mutateAsync, isPending } = useAppMutation<any, { message: string }>();

    const onSubmit = async (values: PayrollFormSchemaType) => {
        if (hasPaymentMade) return;

        const res = await mutateAsync({
            method: !!defaultValues ? 'patch' : 'post',
            endpoint: QueryKey.PAYROLLS,
            id: payrollId,
            data: {
                ...values,
                salaryAdjustments: values.advance > 0
                    ? [
                        ...(values.salaryAdjustments ?? []),
                        {
                            amount: values.advance,
                            description: 'Advance',
                            type: ESalaryAdjustmentType.Advance
                        }
                    ] : values.salaryAdjustments
            },
            invalidateTags: [QueryKey.PAYROLLS, 'employees', salaryEmployee.employee?.employeeId?.toString()]
        });

        queryClient.invalidateQueries({
            queryKey: [QueryKey.PAYROLLS, 'employees', salaryEmployee.employee?.id], // invalidate last payroll
        });

        if (res.data?.message && !payrollId) { // when new payroll is created
            setSearchParams('sub-tab', 'last');
        };
    };

    const hasPaymentMade = !!paidSalary;

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'salaryAdjustments',
    });

    return (
        <AppForm schema={payrollSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
                <section className="flex justify-between items-end gap-6">
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Salary Month</FormLabel>
                                <FormControl>
                                    <Input
                                        type="month"
                                        {...field}
                                        readOnly
                                        min={
                                            salaryEmployee.lastPayrollDate
                                                ? format(salaryEmployee.lastPayrollDate, 'yyyy-MM-dd')
                                                : new Date().toISOString().split('T')[0]
                                        }
                                        value={field.value ? format(new Date(field.value), 'yyyy-MM') : ''}
                                        onChange={() => { }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {
                        searchParams.get('sub-tab') === 'last' && <PayrollPrintBtn salaryEmployee={salaryEmployee} />
                    }
                </section>

                <section className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 max-w-screen-sm">
                        <h2 className="font-semibold uppercase">Salary Amount</h2>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Particulars</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Basic Salary</TableCell>
                                    <TableCell className="text-right font-semibold">
                                        Rs. {salaryEmployee.basicSalary?.toLocaleString()}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Allowances</TableCell>
                                    <TableCell className="text-right font-semibold">
                                        Rs. {salaryEmployee.allowances?.reduce((acc, item) => acc + item.amount, 0)?.toLocaleString()}
                                    </TableCell>
                                </TableRow>
                                {
                                    !!salaryEmployee.employee?.payAmount && <TableRow>
                                        <TableCell>Unpaid Salary</TableCell>
                                        <TableCell className="text-right font-semibold">
                                            Rs. {salaryEmployee.employee?.payAmount?.toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                }
                                {
                                    !!salaryEmployee.lastAdvanceAmount && <TableRow>
                                        <TableCell>Previous Advance</TableCell>
                                        <TableCell className="text-right font-semibold">
                                            - Rs. {salaryEmployee.lastAdvanceAmount?.toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                }
                                <TableRow className="hover:bg-transparent">
                                    <TableCell className="text-right font-semibold text-lg" colSpan={2}>
                                        Total Earnings: &nbsp;
                                        Rs. {totalEarnings.toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <section className="flex items-center gap-5 !mt-10">
                            <span>Advance amount this month: </span>
                            <AppForm.Number<PayrollFormSchemaType>
                                name={`advance`}
                                placeholder="eg. 1000"
                                inputClassName="w-40"
                                min={0}
                                readOnly={hasPaymentMade}
                            />
                        </section>
                    </div>

                    <div className="space-y-2">
                        <h2 className="font-semibold uppercase">Adjustments</h2>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Particulars</TableHead>
                                    <TableHead className="w-52">Type</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    fields.map((field, index) => (
                                        <TableRow key={field.id}>
                                            <TableCell>
                                                <AppForm.Text
                                                    name={`salaryAdjustments.${index}.description`}
                                                    placeholder="eg. Tax (13%)"
                                                    readOnly={hasPaymentMade}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormField
                                                    control={form.control}
                                                    name={`salaryAdjustments.${index}.type`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger aria-readonly={hasPaymentMade} className={cn(hasPaymentMade && "pointer-events-none")}>
                                                                        <SelectValue placeholder="Select a type" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value={ESalaryAdjustmentType.Deduction}>Deduction</SelectItem>
                                                                    <SelectItem value={ESalaryAdjustmentType.Bonus}>Bonus</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <AppForm.Number
                                                    name={`salaryAdjustments.${index}.amount`}
                                                    placeholder="eg. 1000"
                                                    readOnly={hasPaymentMade}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    !hasPaymentMade && <Button type="button" variant={'destructive'} size={'icon'} onClick={() => remove(index)}>
                                                        <Minus />
                                                    </Button>
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                                <TableRow className="hover:bg-transparent">
                                    <TableCell>
                                        {
                                            !hasPaymentMade && <Button
                                                type="button"
                                                variant={'outline'}
                                                size={'sm'}
                                                onClick={() => append({ amount: 0, description: '', type: ESalaryAdjustmentType.Deduction })}
                                            >
                                                <Plus />
                                                Add
                                            </Button>
                                        }
                                    </TableCell>
                                    {
                                        fields?.length > 0 && <TableCell className="text-right font-semibold text-lg" colSpan={2}>
                                            Total Adjustments: &nbsp;
                                            Rs. {totalAdjustments.toLocaleString()}
                                        </TableCell>
                                    }
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </section>


                <section className="text-center text-xl px-4 !mt-10">
                    Net Salary:&nbsp;
                    <strong>Rs. {(totalEarnings + totalAdjustments + +form.watch('advance')).toLocaleString()}</strong>
                </section>
                {
                    !hasPaymentMade && <section className="flex justify-center">
                        <LoadingButton
                            isLoading={isPending}
                            loadingText={payrollId ? 'Updating...' : 'Generating...'}
                            type="submit"
                            disabled={isPending}
                        >
                            {payrollId ? 'Update Payroll' : 'Generate Payroll'}
                        </LoadingButton>
                    </section>
                }
                {
                    payrollId && !hasPaymentMade && (
                        <div className="bg-info/10 text-info text-sm rounded-md p-2 mt-2 mx-auto w-fit flex items-center">
                            <TriangleAlert size={16} className="mr-2" /> Once a payment is made, the payroll can't be update anymore.
                        </div>
                    )
                }
            </form>
        </AppForm >
    )
}