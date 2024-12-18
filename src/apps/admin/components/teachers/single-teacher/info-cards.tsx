import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Cake, Calendar as CalendarIcon, GraduationCap, Heart, Droplet, CreditCard } from "lucide-react"
import { formatDate } from '@/utils/format-date'

type Props = {
    employee: {
        dob: string,
        joinedDate: string,
        qualification: string,
        bloodGroup: string,
        gender: string,
        maritalStatus: string,
        profileImageUrl: string | null,
    }
}

export default function PersonalInfoCard({ employee }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium"><Cake className="w-4 h-4 inline mr-2" />Date of Birth</TableCell>
                            <TableCell>{formatDate({ date: new Date(employee.dob) })}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium"><CalendarIcon className="w-4 h-4 inline mr-2" />Joined Date</TableCell>
                            <TableCell>{formatDate({ date: new Date(employee.joinedDate) })}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium"><GraduationCap className="w-4 h-4 inline mr-2" />Qualification</TableCell>
                            <TableCell>{employee.qualification}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium"><Heart className="w-4 h-4 inline mr-2" />Marital Status</TableCell>
                            <TableCell>{employee.maritalStatus}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium"><Droplet className="w-4 h-4 inline mr-2" />Blood Group</TableCell>
                            <TableCell>{employee.bloodGroup}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export function FinancialInfoCard({ employee }: {
    employee: {
        bankName: string,
        accountName: string,
        accountNumber: string
    }
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Financial Information</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium"><CreditCard className="w-4 h-4 inline mr-2" />Bank Name</TableCell>
                            <TableCell>{employee.bankName}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Account Number</TableCell>
                            <TableCell>{employee.accountNumber}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Account Name</TableCell>
                            <TableCell>{employee.accountName}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}