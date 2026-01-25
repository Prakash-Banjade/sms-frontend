import { ESalaryAdjustmentType, TSalaryPaymentResponse, TSinglePayroll } from "@/apps/admin/types/finance-system/salary-management.types"
import { format, lastDayOfMonth, startOfMonth } from "date-fns"
import { Info } from "lucide-react"
import React from "react"

type Props = {
    data: TSinglePayroll | undefined
    payment: TSalaryPaymentResponse["data"][0]

}

export const SalaryPayslipTemplate = React.forwardRef<HTMLDivElement, Props>(({ data, payment }, ref) => {
    if (!data) return null;

    const employee = data.employee;

    const deductions = data.salaryAdjustments?.filter(sa => sa.type === ESalaryAdjustmentType.Deduction);
    const absentAdjustment = data.salaryAdjustments?.find(salaryAdjustment => salaryAdjustment.type === ESalaryAdjustmentType.Absent);
    const libraryFineAdjustment = data.salaryAdjustments?.find(salaryAdjustment => salaryAdjustment.type === ESalaryAdjustmentType.Library_Fine);

    const allowanceAmount = data.salaryAdjustments?.find(salaryAdjustment => salaryAdjustment.type === ESalaryAdjustmentType.Allowance)?.amount ?? 0;
    const previousAdvanceAmount = data.salaryAdjustments?.find(salaryAdjustment => salaryAdjustment.type === ESalaryAdjustmentType.Past_Advance)?.amount ?? 0;
    const advanceAmount = data.salaryAdjustments?.find(salaryAdjustment => salaryAdjustment.type === ESalaryAdjustmentType.Advance)?.amount ?? 0;
    const unpaidAmount = data.salaryAdjustments?.find(salaryAdjustment => salaryAdjustment.type === ESalaryAdjustmentType.Unpaid)?.amount ?? 0;
    const totalBonus = data.salaryAdjustments?.filter(sa => sa.type === ESalaryAdjustmentType.Bonus)?.reduce((acc, curr) => acc + curr.amount, 0) ?? 0;
    const absentFine = absentAdjustment?.amount ?? 0;
    const libraryFine = libraryFineAdjustment?.amount ?? 0;
    const totalDeduction = previousAdvanceAmount + (deductions?.reduce((acc, curr) => acc + curr.amount, 0) ?? 0) + absentFine + libraryFine;
    const totalEarnings = data.basicSalary + allowanceAmount + unpaidAmount + totalBonus + advanceAmount;

    return (
        <div className="min-h-[297mm] w-[210mm] mx-auto bg-white shadow-lg rounded-lg overflow-hidden" ref={ref}>
            <div className="bg-gray-50 border-b p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Employee Payslip</h1>
                        <p className="text-sm text-gray-600">Pay Period: {format(startOfMonth(data.date), 'MMM dd, yyyy')} - {format(lastDayOfMonth(data.date), 'MMM dd, yyyy')}</p>
                    </div>
                </div>
            </div>
            <div className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg text-gray-800">Employee Information</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <p className="text-gray-600">Name:</p>
                            <p className="font-medium text-gray-900">{employee.fullName}</p>
                            <p className="text-gray-600">Employee ID:</p>
                            <p className="font-medium text-gray-900">{employee.employeeId}</p>
                            <p className="text-gray-600">Position:</p>
                            <p className="font-medium text-gray-900 capitalize">{employee.designation}</p>
                            <p className="text-gray-600">Pay Frequency:</p>
                            <p className="font-medium text-gray-900">Monthly</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg text-gray-800">Company Information</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <p className="text-gray-600">Company Name:</p>
                            <p className="font-medium text-gray-900">Loomis Global Academy</p>
                            <p className="text-gray-600">Address:</p>
                            <p className="font-medium text-gray-900">123 Tech Avenue, Suite 200</p>
                            <p className="text-gray-600">City, State ZIP:</p>
                            <p className="font-medium text-gray-900">San Francisco, CA 94105</p>
                            <p className="text-gray-600">Phone:</p>
                            <p className="font-medium text-gray-900">(555) 123-4567</p>
                            <p className="text-gray-600">Website:</p>
                            <p className="font-medium text-gray-900 wrap-break-word">www.loomisglobal.com</p>
                        </div>
                    </div>
                </div>

                <hr className="border-t border-gray-200" />

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg text-gray-800">Earnings</h3>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Particular</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Base Salary</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">Rs. {data.basicSalary?.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Allowances</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">Rs. {allowanceAmount?.toLocaleString()}</td>
                            </tr>
                            {
                                unpaidAmount > 0 && <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Unpaid Salary</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">Rs. {unpaidAmount?.toLocaleString()}</td>
                                </tr>
                            }
                            {
                                advanceAmount > 0 && <tr className="font-semibold">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Advance Amount this month</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">Rs. {advanceAmount?.toLocaleString()}</td>
                                </tr>
                            }
                            {
                                data?.salaryAdjustments?.filter(sa => sa.type === ESalaryAdjustmentType.Bonus)?.map(sa => (
                                    <tr className="font-semibold" key={sa.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sa.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">Rs. {sa.amount?.toLocaleString()}</td>
                                    </tr>
                                ))
                            }
                            <tr className="font-semibold">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Gross Earnings</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">Rs. {totalEarnings?.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-800">Deductions</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {
                                previousAdvanceAmount > 0 && <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Previous Advance</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">Rs. {previousAdvanceAmount?.toLocaleString()}</td>
                                </tr>
                            }
                            {
                                absentFine > 0 && <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{absentAdjustment?.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">Rs. {absentFine?.toLocaleString()}</td>
                                </tr>
                            }
                            {
                                libraryFine > 0 && <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{libraryFineAdjustment?.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">Rs. {libraryFine?.toLocaleString()}</td>
                                </tr>
                            }
                            {
                                deductions?.map(sa => (
                                    <tr key={sa.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sa.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">Rs. {sa.amount?.toLocaleString()}</td>
                                    </tr>
                                ))
                            }
                            {
                                totalDeduction > 0 && <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Total Deductions</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">Rs. {totalDeduction?.toLocaleString()}</td>
                                </tr>
                            }

                            {/* fallback */}
                            {
                                previousAdvanceAmount === 0 && !deductions?.length && <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">No deductions</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>

                <hr className="border-t border-gray-200" />

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                    <div className="space-y-1">
                        <p className="text-lg font-semibold text-gray-800">Grand Total: Rs. {data.netSalary?.toLocaleString()}</p>
                        <p className="text-lg font-semibold text-gray-800">Paid Amount: Rs. {payment.amount?.toLocaleString()}</p>
                        <p className="text-lg font-semibold text-gray-800">Remaining: Rs. {(data.netSalary - payment.amount)?.toLocaleString()}</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm text-blue-800">
                        <h4 className="font-semibold mb-2">Payment Information</h4>
                        <p className="capitalize">Payment Method: {payment.paymentMethod}</p>
                        {/* <p>Bank: National Bank</p>
                        <p>Account Number: XXXX-XXXX-1234</p> */}
                        <p>Payment Date: {new Date(payment.paymentDate).toDateString()}</p>
                    </div>
                </div>

                <div className="text-sm text-gray-500 space-y-2">
                    <p className="flex">
                        <Info className="mr-2" size={18} />
                        This payslip is for informational purposes only. Please contact the HR department for any discrepancies.
                    </p>
                    <p>Generated on: {new Date(payment.paymentDate).toDateString()}</p>
                </div>
            </div>
        </div>
    )
})
