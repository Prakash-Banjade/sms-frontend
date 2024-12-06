import AppForm from "@/components/forms/app-form"
import { ESalaryAdjustmentType, TSalaryEmployee } from "@/types/finance-system/salary-management.types"
import { zodResolver } from "@hookform/resolvers/zod"
import { addMonths, format } from "date-fns"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { startOfDayString } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useMemo } from "react"
import { Plus } from "lucide-react"

type Props = {
    salaryEmployee: TSalaryEmployee,
}

const payrollSchema = z.object({
    employeeId: z.string({ required_error: 'Employee ID is required' }).uuid({ message: 'Employee ID must be a valid UUID' }),
    date: z.string({ required_error: 'Date is required' }).datetime({ message: 'A valid date is required' }),
    salaryAdjustments: z.array(z.object({
        amount: z.coerce.number().min(0, { message: 'Amount must be greater than 0' }),
        description: z.string({ required_error: 'Description is required' })
            .min(1, { message: 'Description is required' })
            .max(50, { message: 'Description must be less than 50 characters' }),
        type: z.nativeEnum(ESalaryAdjustmentType, {
            errorMap: () => ({ message: 'Invalid salary adjustment type' })
        })
    })).optional(),
});

type PayrollFormSchemaType = z.infer<typeof payrollSchema>;

export default function PayrollForm({ salaryEmployee }: Props) {
    const form = useForm<PayrollFormSchemaType>({
        resolver: zodResolver(payrollSchema),
        defaultValues: {
            employeeId: salaryEmployee.employee?.id,
            date: salaryEmployee.lastPayrollDate
                ? startOfDayString(addMonths(salaryEmployee.lastPayrollDate, 1))
                : startOfDayString(new Date()),
            salaryAdjustments: [],
        }
    });

    const totalAdjustments = useMemo(() => {
        return form.watch('salaryAdjustments')?.reduce((acc, curr) => acc + curr.amount, 0) ?? 0;
    }, [form.watch('salaryAdjustments')])

    const onSubmit = async (values: PayrollFormSchemaType) => {
        console.log(values);
    };

    return (
        <AppForm schema={payrollSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
                <section className="grid grid-cols-4 gap-6">
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
                                        min={
                                            salaryEmployee.lastPayrollDate
                                                ? format(salaryEmployee.lastPayrollDate, 'yyyy-MM-dd')
                                                : new Date().toISOString().split('T')[0]
                                        }
                                        value={field.value ? format(new Date(field.value), 'yyyy-MM') : ''}
                                        onChange={e => {
                                            if (e.target.value) {
                                                field.onChange(startOfDayString(new Date(e.target.value)))
                                            } else {
                                                field.onChange('')
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </section>

                <section className="max-w-screen-sm mx-auto">
                    <div className="space-y-2">
                        <h2 className="font-semibold uppercase text-center">Salary Amount</h2>
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
                            </TableBody>
                        </Table>
                    </div>

                    <div className="space-y-4">
                        <h2 className="font-semibold uppercase text-center">Deductions</h2>
                        <Table>
                            <TableBody>

                                <TableRow className="hover:bg-transparent font-medium">
                                    <TableCell>
                                        <Button type="button" variant={'outline'} size={'sm'}>
                                            <Plus />
                                            Deduction
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div className="space-y-2">
                        <h2 className="font-semibold uppercase text-center">Advance</h2>
                        <Table>
                            <TableBody>
                                <TableRow className="hover:bg-transparent font-medium">
                                    <TableCell>
                                        <Button type="button" variant={'outline'} size={'sm'}>
                                            <Plus />
                                            Advance
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <section className="text-right text-base px-4 mt-8">
                        Net Salary:&nbsp;
                        <strong>Rs. {(salaryEmployee.grossSalary + totalAdjustments).toLocaleString()}</strong>
                    </section>
                </section>


                <section className="flex justify-center">
                    <Button>Generate Payroll</Button>
                </section>
            </form>
        </AppForm>
    )
}