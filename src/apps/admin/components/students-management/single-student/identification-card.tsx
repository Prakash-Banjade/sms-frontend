import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TSingleStudent } from "@/types/student.type"
import { CreditCard } from "lucide-react"

type Props = {
    student: TSingleStudent
}

export default function Student_IdentificationCard({ student }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Identification
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <div className="text-sm text-gray-500">National ID Card No.</div>
                        <div className="font-medium">{student.nationalIdCardNo || 'Not provided'}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Birth Certificate Number</div>
                        <div className="font-medium">{student.birthCertificateNumber || 'Not provided'}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}