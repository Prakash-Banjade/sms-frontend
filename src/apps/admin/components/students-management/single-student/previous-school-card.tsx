import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TSingleStudent } from "@/types/student.type"
import { School } from "lucide-react"

type Props = {
    student: TSingleStudent
}

export default function Student_PreviousSchoolCard({ student }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <School className="h-5 w-5" />
                    Previous School Information
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <div className="text-sm text-gray-500">School Name</div>
                        <div className="font-medium">
                            {student.previousSchoolName || 'Not provided'}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Additional Details</div>
                        <div className="font-medium">
                            {student.previousSchoolDetails || 'Not provided'}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}