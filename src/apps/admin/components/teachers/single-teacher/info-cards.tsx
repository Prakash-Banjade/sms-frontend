import { TSingleTeacherDetail } from '@/types/teacher.type'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Cake, Calendar as CalendarIcon, GraduationCap, Heart, Droplet, CreditCard, DollarSign } from "lucide-react"
import { formatDate } from '@/utils/format-date'

type Props = {
    teacher: TSingleTeacherDetail;
}

export default function PersonalInfoCard({ teacher }: Props) {
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
                            <TableCell>{formatDate({ date: new Date(teacher.dob) })}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium"><CalendarIcon className="w-4 h-4 inline mr-2" />Joined Date</TableCell>
                            <TableCell>{formatDate({ date: new Date(teacher.joinedDate) })}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium"><GraduationCap className="w-4 h-4 inline mr-2" />Qualification</TableCell>
                            <TableCell>{teacher.qualification}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium"><Heart className="w-4 h-4 inline mr-2" />Marital Status</TableCell>
                            <TableCell>{teacher.maritalStatus}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium"><Droplet className="w-4 h-4 inline mr-2" />Blood Group</TableCell>
                            <TableCell>{teacher.bloodGroup}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export function FinancialInfoCard({ teacher }: Props) {
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
                            <TableCell>{teacher.bankName}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Account Number</TableCell>
                            <TableCell>{teacher.accountNumber}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Account Name</TableCell>
                            <TableCell>{teacher.accountName}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}