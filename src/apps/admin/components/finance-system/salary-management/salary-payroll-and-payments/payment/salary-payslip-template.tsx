import React from 'react'
import { PrinterIcon, DownloadIcon, InfoIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function ProfessionalPayslip() {
    const [showYTD, setShowYTD] = React.useState(false)

    const toggleYTD = () => setShowYTD(!showYTD)

    return (
        <Card className="w-full max-w-5xl mx-auto bg-white shadow-lg">
            <CardHeader className="bg-gray-50 border-b">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-2xl font-bold text-gray-800">Employee Payslip</CardTitle>
                        <p className="text-sm text-gray-600">Pay Period: May 1, 2023 - May 31, 2023</p>
                    </div>
                    <div className="flex space-x-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <PrinterIcon className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Print Payslip</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <DownloadIcon className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Download Payslip</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg text-gray-800">Employee Information</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <p className="text-gray-600">Name:</p>
                            <p className="font-medium">John Doe</p>
                            <p className="text-gray-600">Employee ID:</p>
                            <p className="font-medium">EMP001</p>
                            <p className="text-gray-600">Department:</p>
                            <p className="font-medium">Information Technology</p>
                            <p className="text-gray-600">Position:</p>
                            <p className="font-medium">Senior Software Engineer</p>
                            <p className="text-gray-600">Pay Frequency:</p>
                            <p className="font-medium">Monthly</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg text-gray-800">Company Information</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <p className="text-gray-600">Company Name:</p>
                            <p className="font-medium">TechCorp Solutions Inc.</p>
                            <p className="text-gray-600">Address:</p>
                            <p className="font-medium">123 Tech Avenue, Suite 200</p>
                            <p className="text-gray-600">City, State ZIP:</p>
                            <p className="font-medium">San Francisco, CA 94105</p>
                            <p className="text-gray-600">Phone:</p>
                            <p className="font-medium">(555) 123-4567</p>
                            <p className="text-gray-600">Website:</p>
                            <p className="font-medium">www.techcorpsolutions.com</p>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg text-gray-800">Earnings</h3>
                        <Button variant="outline" size="sm" onClick={toggleYTD}>
                            {showYTD ? 'Hide' : 'Show'} Year-to-Date
                        </Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="font-semibold">Description</TableHead>
                                <TableHead className="text-right font-semibold">Hours/Units</TableHead>
                                <TableHead className="text-right font-semibold">Rate</TableHead>
                                <TableHead className="text-right font-semibold">Current</TableHead>
                                {showYTD && <TableHead className="text-right font-semibold">YTD</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Base Salary</TableCell>
                                <TableCell className="text-right">160.00</TableCell>
                                <TableCell className="text-right">$62.50</TableCell>
                                <TableCell className="text-right">$10,000.00</TableCell>
                                {showYTD && <TableCell className="text-right">$50,000.00</TableCell>}
                            </TableRow>
                            <TableRow>
                                <TableCell>Overtime</TableCell>
                                <TableCell className="text-right">10.00</TableCell>
                                <TableCell className="text-right">$93.75</TableCell>
                                <TableCell className="text-right">$937.50</TableCell>
                                {showYTD && <TableCell className="text-right">$3,750.00</TableCell>}
                            </TableRow>
                            <TableRow>
                                <TableCell>Performance Bonus</TableCell>
                                <TableCell className="text-right">-</TableCell>
                                <TableCell className="text-right">-</TableCell>
                                <TableCell className="text-right">$1,500.00</TableCell>
                                {showYTD && <TableCell className="text-right">$3,000.00</TableCell>}
                            </TableRow>
                            <TableRow className="font-semibold">
                                <TableCell>Total Earnings</TableCell>
                                <TableCell className="text-right">170.00</TableCell>
                                <TableCell className="text-right">-</TableCell>
                                <TableCell className="text-right">$12,437.50</TableCell>
                                {showYTD && <TableCell className="text-right">$56,750.00</TableCell>}
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-800">Deductions & Contributions</h3>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="font-semibold">Description</TableHead>
                                <TableHead className="text-right font-semibold">Employee</TableHead>
                                <TableHead className="text-right font-semibold">Employer</TableHead>
                                <TableHead className="text-right font-semibold">Current</TableHead>
                                {showYTD && <TableHead className="text-right font-semibold">YTD</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Federal Income Tax</TableCell>
                                <TableCell className="text-right">$2,300.00</TableCell>
                                <TableCell className="text-right">-</TableCell>
                                <TableCell className="text-right">$2,300.00</TableCell>
                                {showYTD && <TableCell className="text-right">$11,500.00</TableCell>}
                            </TableRow>
                            <TableRow>
                                <TableCell>Social Security</TableCell>
                                <TableCell className="text-right">$771.13</TableCell>
                                <TableCell className="text-right">$771.13</TableCell>
                                <TableCell className="text-right">$771.13</TableCell>
                                {showYTD && <TableCell className="text-right">$3,855.65</TableCell>}
                            </TableRow>
                            <TableRow>
                                <TableCell>Medicare</TableCell>
                                <TableCell className="text-right">$180.34</TableCell>
                                <TableCell className="text-right">$180.34</TableCell>
                                <TableCell className="text-right">$180.34</TableCell>
                                {showYTD && <TableCell className="text-right">$901.70</TableCell>}
                            </TableRow>
                            <TableRow>
                                <TableCell>State Income Tax</TableCell>
                                <TableCell className="text-right">$750.00</TableCell>
                                <TableCell className="text-right">-</TableCell>
                                <TableCell className="text-right">$750.00</TableCell>
                                {showYTD && <TableCell className="text-right">$3,750.00</TableCell>}
                            </TableRow>
                            <TableRow>
                                <TableCell>401(k) Contribution</TableCell>
                                <TableCell className="text-right">$745.50</TableCell>
                                <TableCell className="text-right">$372.75</TableCell>
                                <TableCell className="text-right">$745.50</TableCell>
                                {showYTD && <TableCell className="text-right">$3,727.50</TableCell>}
                            </TableRow>
                            <TableRow>
                                <TableCell>Health Insurance</TableCell>
                                <TableCell className="text-right">$250.00</TableCell>
                                <TableCell className="text-right">$750.00</TableCell>
                                <TableCell className="text-right">$250.00</TableCell>
                                {showYTD && <TableCell className="text-right">$1,250.00</TableCell>}
                            </TableRow>
                            <TableRow className="font-semibold">
                                <TableCell>Total Deductions</TableCell>
                                <TableCell className="text-right">$4,996.97</TableCell>
                                <TableCell className="text-right">$2,074.22</TableCell>
                                <TableCell className="text-right">$4,996.97</TableCell>
                                {showYTD && <TableCell className="text-right">$24,984.85</TableCell>}
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                <Separator />

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                    <div className="space-y-1">
                        <p className="text-lg font-semibold text-gray-800">Net Pay: $7,440.53</p>
                        {showYTD && <p className="text-sm text-gray-600">YTD Net Pay: $31,765.15</p>}
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
                    <p>
                        <InfoIcon className="inline-block w-4 h-4 mr-1" />
                        This payslip is for informational purposes only. Please contact the HR department for any discrepancies.
                    </p>
                    <p>Generated on: {new Date().toLocaleString()}</p>
                </div>
            </CardContent>
        </Card>
    )
}

