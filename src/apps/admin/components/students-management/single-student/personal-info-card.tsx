import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TSingleStudent } from "@/types/student.type"
import { formatDate } from "@/utils/format-date";
import { User } from "lucide-react"

type Props = {
    student: TSingleStudent;
}

export default function Student_PersonalInfoCard({ student }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                        <div className="text-sm text-gray-500">Gender</div>
                        <div className="font-medium capitalize">{student.gender || 'Not provided'}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Date of Birth</div>
                        <div className="font-medium">{formatDate({ date: new Date(student.dob) })}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Religion</div>
                        <div className="font-medium capitalize">{student.religion || 'Not provided'}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Caste</div>
                        <div className="font-medium capitalize">{student.caste || 'Not provided'}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Blood Group</div>
                        <div className="font-medium">{student.bloodGroup || 'Not provided'}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Physically Challenged</div>
                        <div className="font-medium">{student.isPhysicallyChallenged ? 'Yes' : 'No'}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}