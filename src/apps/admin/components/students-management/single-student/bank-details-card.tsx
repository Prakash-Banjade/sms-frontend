import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TSingleStudent } from "@/types/student.type"
import { Building2 } from "lucide-react"

type Props = {
    student: TSingleStudent
}

export default function Student_BankDetailsCard({ student }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Bank Details
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <div className="text-sm text-gray-500">Bank Name</div>
                        <div className="font-medium">
                            {student.bankName || 'Not provided'}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Account Number</div>
                        <div className="font-medium">
                            {student.bankAccountNumber || 'Not provided'}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">IFSC Code</div>
                        <div className="font-medium">
                            {student.ifscCode || 'Not provided'}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}