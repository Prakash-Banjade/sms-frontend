import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TSingleStudent } from "@/types/student.type"
import { Mail, MapPin, Phone } from "lucide-react"
type Props = {
    student: TSingleStudent
}

export default function Student_ContactInfoCard({ student }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contact Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {student.email || 'Not provided'}
                    </div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    <div className="font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {student.phone || 'Not provided'}
                    </div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Current Address</div>
                    <div className="font-medium flex items-center gap-2 capitalize">
                        <MapPin className="h-4 w-4" />
                        {student.currentAddress || 'Not provided'}
                    </div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Permanent Address</div>
                    <div className="font-medium flex items-center gap-2 capitalize">
                        <MapPin className="h-4 w-4" />
                        {student.permanentAddress || 'Not provided'}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}