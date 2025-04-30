import { TSalaryPaymentResponse } from "@/apps/admin/types/finance-system/salary-management.types"
import { useGetSalaryPayroll } from "../../data-access"

type Props = {
    payment: TSalaryPaymentResponse["data"][0]
}

export default function SalaryPaySlipTemplate({ payment }: Props) {
    const { data, isLoading } = useGetSalaryPayroll({ id: payment.payrollId });

    if (isLoading) return <div>Loading...</div>;

    if (!data) return null;

    const { employee } = data;

    return (
        <div className="min-h-[297mm] w-[210mm] mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-gray-50 border-b p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Employee Payslip</h1>
                        <p className="text-sm text-gray-600">Pay Period: May 1, 2023 - May 31, 2023</p>
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
                            <p className="font-medium text-gray-900">Aayam Global Academy</p>
                            <p className="text-gray-600">Address:</p>
                            <p className="font-medium text-gray-900">123 Tech Avenue, Suite 200</p>
                            <p className="text-gray-600">City, State ZIP:</p>
                            <p className="font-medium text-gray-900">San Francisco, CA 94105</p>
                            <p className="text-gray-600">Phone:</p>
                            <p className="font-medium text-gray-900">(555) 123-4567</p>
                            <p className="text-gray-600">Website:</p>
                            <p className="font-medium text-gray-900 break-words">www.aayamglobal.com</p>
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
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hours/Units</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Current</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Base Salary</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">160.00</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">$62.50</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">$10,000.00</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Overtime</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">10.00</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">$93.75</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">$937.50</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Performance Bonus</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">-</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">-</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">$1,500.00</td>
                            </tr>
                            <tr className="font-semibold">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Total Earnings</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">170.00</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">-</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">$12,437.50</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-800">Deductions & Contributions</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Employer</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Current</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Federal Income Tax</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">$2,300.00</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">-</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">$2,300.00</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Social Security</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">$771.13</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">$771.13</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">$771.13</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Medicare</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">$180.34</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">$180.34</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">$180.34</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">State Income Tax</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">$750.00</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">-</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">$750.00</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">401(k) Contribution</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">$745.50</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">$372.75</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">$745.50</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Health Insurance</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">$250.00</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">$750.00</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">$250.00</td>
                            </tr>
                            <tr className="font-semibold">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Total Deductions</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">$4,996.97</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">$2,074.22</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">$4,996.97</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <hr className="border-t border-gray-200" />

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                    <div className="space-y-1">
                        <p className="text-lg font-semibold text-gray-800">Net Pay: $7,440.53</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm text-blue-800">
                        <h4 className="font-semibold mb-2">Payment Information</h4>
                        <p>Payment Method: Direct Deposit</p>
                        <p>Bank: National Bank</p>
                        <p>Account Number: XXXX-XXXX-1234</p>
                        <p>Payment Date: June 5, 2023</p>
                    </div>
                </div>

                <div className="text-sm text-gray-500 space-y-2">
                    <p className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        This payslip is for informational purposes only. Please contact the HR department for any discrepancies.
                    </p>
                    <p>Generated on: {new Date().toLocaleString()}</p>
                </div>
            </div>
        </div>
    )
}

