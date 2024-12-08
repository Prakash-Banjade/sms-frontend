import { CalendarIcon, DownloadIcon, HelpCircleIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"

export default function PayrollTemplate() {
    return (
        <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
            <CardHeader className="bg-gray-50 border-b">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-2xl font-bold text-gray-800">Employee Salary Payroll</CardTitle>
                        <p className="text-sm text-gray-600">Pay Period: June 1, 2023 - June 30, 2023</p>
                    </div>
                    <Button variant="outline" size="icon">
                        <DownloadIcon className="h-4 w-4" />
                        <span className="sr-only">Download Payroll</span>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg text-gray-800">Employee Information</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <p className="text-gray-600">Name:</p>
                            <p className="font-medium">Jane Smith</p>
                            <p className="text-gray-600">Employee ID:</p>
                            <p className="font-medium">EMP2023</p>
                            <p className="text-gray-600">Department:</p>
                            <p className="font-medium">Marketing</p>
                            <p className="text-gray-600">Position:</p>
                            <p className="font-medium">Senior Marketing Specialist</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg text-gray-800">Payment Details</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <p className="text-gray-600">Pay Date:</p>
                            <p className="font-medium">July 5, 2023</p>
                            <p className="text-gray-600">Pay Frequency:</p>
                            <p className="font-medium">Monthly</p>
                            <p className="text-gray-600">Payment Method:</p>
                            <p className="font-medium">Direct Deposit</p>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-800">Earnings</h3>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="font-semibold">Description</TableHead>
                                <TableHead className="text-right font-semibold">Rate</TableHead>
                                <TableHead className="text-right font-semibold">Hours</TableHead>
                                <TableHead className="text-right font-semibold">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Base Salary</TableCell>
                                <TableCell className="text-right">$35.00/hr</TableCell>
                                <TableCell className="text-right">160</TableCell>
                                <TableCell className="text-right">$5,600.00</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Overtime</TableCell>
                                <TableCell className="text-right">$52.50/hr</TableCell>
                                <TableCell className="text-right">10</TableCell>
                                <TableCell className="text-right">$525.00</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Performance Bonus</TableCell>
                                <TableCell className="text-right">-</TableCell>
                                <TableCell className="text-right">-</TableCell>
                                <TableCell className="text-right">$1,000.00</TableCell>
                            </TableRow>
                            <TableRow className="font-semibold">
                                <TableCell>Gross Earnings</TableCell>
                                <TableCell className="text-right">-</TableCell>
                                <TableCell className="text-right">170</TableCell>
                                <TableCell className="text-right">$7,125.00</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

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
                            <TableRow>
                                <TableCell>Federal Income Tax</TableCell>
                                <TableCell className="text-right">$1,068.75</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>State Income Tax</TableCell>
                                <TableCell className="text-right">$356.25</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Social Security</TableCell>
                                <TableCell className="text-right">$441.75</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Medicare</TableCell>
                                <TableCell className="text-right">$103.31</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Health Insurance</TableCell>
                                <TableCell className="text-right">$250.00</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>401(k) Contribution</TableCell>
                                <TableCell className="text-right">$427.50</TableCell>
                            </TableRow>
                            <TableRow className="font-semibold">
                                <TableCell>Total Deductions</TableCell>
                                <TableCell className="text-right">$2,647.56</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                <Separator />

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                    <div className="space-y-1">
                        <p className="text-xl font-bold text-gray-800">Net Pay: $4,477.44</p>
                        <p className="text-sm text-gray-600">Year-to-Date (YTD) Earnings: $32,850.00</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm">
                        <h4 className="font-semibold text-blue-800 mb-2">Direct Deposit Information</h4>
                        <p>Bank: National Bank</p>
                        <p>Account: XXXX-XXXX-5678 (Checking)</p>
                        <p>Routing Number: XXXXXXXXX</p>
                    </div>
                </div>

                <div className="text-sm text-gray-500 space-y-2">
                    <p className="flex items-center">
                        <HelpCircleIcon className="w-4 h-4 mr-1" />
                        For questions about your payroll, please contact HR at hr@company.com or ext. 1234.
                    </p>
                    <p className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        Next Pay Date: August 5, 2023
                    </p>
                </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t p-4 text-sm text-gray-500">
                <p>This payroll statement is for informational purposes only and does not constitute a contract.</p>
            </CardFooter>
        </Card>
    )
}

