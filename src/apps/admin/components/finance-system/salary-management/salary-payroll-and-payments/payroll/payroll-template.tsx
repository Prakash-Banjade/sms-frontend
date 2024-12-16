import { CalendarIcon, HelpCircleIcon } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { ESalaryAdjustmentType, TLastPayroll, TSalaryEmployee } from '@/types/finance-system/salary-management.types'
import React from 'react'
import { addMonths, format, lastDayOfMonth, startOfMonth } from 'date-fns'
import { toWords } from '@/lib/utils'

type PayrollTemplateProps = {
    data: TLastPayroll,
    salaryEmployee: TSalaryEmployee
}

export const PayrollTemplate = React.forwardRef<HTMLDivElement, PayrollTemplateProps>(({ data, salaryEmployee }, ref) => {
    if (!data) return null;

    const deductions = data.salaryAdjustments?.filter(sa => sa.type === ESalaryAdjustmentType.Deduction);

    const allowanceAmount = data.salaryAdjustments?.find(salaryAdjustment => salaryAdjustment.type === ESalaryAdjustmentType.Allowance)?.amount ?? 0;
    const previousAdvanceAmount = data.salaryAdjustments?.find(salaryAdjustment => salaryAdjustment.type === ESalaryAdjustmentType.Past_Advance)?.amount ?? 0;
    const advanceAmount = data.salaryAdjustments?.find(salaryAdjustment => salaryAdjustment.type === ESalaryAdjustmentType.Advance)?.amount ?? 0;
    const unpaidAmount = data.salaryAdjustments?.find(salaryAdjustment => salaryAdjustment.type === ESalaryAdjustmentType.Unpaid)?.amount ?? 0;
    const totalBonus = data.salaryAdjustments?.filter(sa => sa.type === ESalaryAdjustmentType.Bonus)?.reduce((acc, curr) => acc + curr.amount, 0) ?? 0;
    const totalDeduction = deductions?.reduce((acc, curr) => acc + curr.amount, 0) ?? 0;
    const totalEarnings = salaryEmployee.grossSalary + unpaidAmount + totalBonus;

    return (
        <Card className="min-h-[297mm] w-[210mm] bg-white text-black mx-auto flex flex-col" ref={ref}>
            <CardHeader className="bg-gray-50 border-b">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-2xl font-bold text-gray-800">Employee Salary Payroll</CardTitle>
                        <p className="text-sm text-gray-600">Pay Period: {format(startOfMonth(data.date), 'MMM dd, yyyy')} - {format(lastDayOfMonth(data.date), 'MMM dd, yyyy')}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
                <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-gray-800">Employee Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <section className='flex items-start gap-2'>
                            <p className="text-gray-600">Name:</p>
                            <p className="font-medium">{salaryEmployee.employee?.fullName}</p>
                        </section>
                        <section className='flex items-start gap-2'>
                            <p className="text-gray-600">Employee ID:</p>
                            <p className="font-medium">{salaryEmployee.employee?.employeeId}</p>
                        </section>
                        <section className='flex items-start gap-2'>
                            <p className="text-gray-600">Position:</p>
                            <p className="font-medium capitalize">{salaryEmployee.employee?.designation}</p>
                        </section>
                        <section className='flex items-start gap-2'>
                            <p className="text-gray-600">Email:</p>
                            <p className="font-medium break-words">{salaryEmployee.employee?.email}</p>
                        </section>
                        <section className='flex items-start gap-2'>
                            <p className="text-gray-600">Phone:</p>
                            <p className="font-medium break-words">{salaryEmployee.employee?.phone}</p>
                        </section>
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-800">Earnings</h3>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="font-semibold">Particular</TableHead>
                                <TableHead className="text-right font-semibold">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Basic Salary</TableCell>
                                <TableCell className="text-right">Rs. {salaryEmployee.basicSalary?.toLocaleString()}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Allowances</TableCell>
                                <TableCell className="text-right">Rs. {allowanceAmount?.toLocaleString()}</TableCell>
                            </TableRow>
                            {
                                unpaidAmount > 0 && <TableRow>
                                    <TableCell>Unpaid Salary</TableCell>
                                    <TableCell className="text-right">Rs. {unpaidAmount?.toLocaleString()}</TableCell>
                                </TableRow>
                            }
                            {
                                advanceAmount > 0 && <TableRow>
                                    <TableCell>Advance Amount this month</TableCell>
                                    <TableCell className="text-right">Rs. {unpaidAmount?.toLocaleString()}</TableCell>
                                </TableRow>
                            }
                            {
                                data?.salaryAdjustments?.filter(sa => sa.type === ESalaryAdjustmentType.Bonus)?.map(sa => (
                                    <TableRow key={sa.id}>
                                        <TableCell>{sa.description}</TableCell>
                                        <TableCell className="text-right">Rs. {sa.amount?.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))
                            }
                            <TableRow className="font-semibold">
                                <TableCell>Gross Earnings</TableCell>
                                <TableCell className="text-right">Rs. {totalEarnings.toLocaleString()}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-gray-800">Deductions</h3>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="font-semibold">Description</TableHead>
                                    <TableHead className="text-right font-semibold">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    previousAdvanceAmount > 0 && <TableRow>
                                        <TableCell>Previous Advance</TableCell>
                                        <TableCell className="text-right">Rs. {previousAdvanceAmount?.toLocaleString()}</TableCell>
                                    </TableRow>
                                }
                                {
                                    deductions?.map(sa => (
                                        <TableRow key={sa.id}>
                                            <TableCell>{sa.description}</TableCell>
                                            <TableCell className="text-right">Rs. {sa.amount?.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))
                                }
                                {
                                    totalDeduction > 0 && <TableRow className="font-semibold">
                                        <TableCell>Total Deductions</TableCell>
                                        <TableCell className="text-right">Rs. {totalDeduction?.toLocaleString()}</TableCell>
                                    </TableRow>
                                }

                                {/* fallback */}
                                {
                                    previousAdvanceAmount === 0 && !deductions?.length && <TableRow>
                                        <TableCell colSpan={2} className='text-gray-500 text-center'>
                                            No Deductions
                                        </TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </div>
                }

                <Separator />

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                    <div className="space-y-1">
                        <p className="text-xl font-bold text-gray-800">Net Pay: Rs. {data.netSalary?.toLocaleString()}</p>
                        <p className='text-gray-500 text-sm'><span className='font-semibold'>In Words</span>: {toWords.convert(data.netSalary, { currency: true, ignoreZeroCurrency: true })}</p>
                    </div>
                    {/* <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm">
                        <h4 className="font-semibold text-blue-800 mb-2">Direct Deposit Information</h4>
                        <p>Bank: National Bank</p>
                        <p>Account: XXXX-XXXX-5678 (Checking)</p>
                        <p>Routing Number: XXXXXXXXX</p>
                    </div> */}
                </div>

                <div className="text-sm text-gray-500 space-y-2">
                    <p className="flex items-center">
                        <HelpCircleIcon className="w-4 h-4 mr-1" />
                        For questions about your payroll, please contact HR at hr@abhyam-groups.com or ext. 1234.
                    </p>
                    <p className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        Next Pay Date: {format(startOfMonth(addMonths(data.date, 1)), 'MMM dd, yyyy')}
                    </p>
                </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t p-4 text-sm text-gray-500 mt-auto">
                <p>This payroll statement is for informational purposes only and does not constitute a contract.</p>
            </CardFooter>
        </Card>
    )
})

