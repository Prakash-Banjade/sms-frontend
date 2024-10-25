import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TSingleStudent } from "@/types/student.type"
import { Users } from "lucide-react"

type Props = {
    student: TSingleStudent;
}

export default function Student_GuardianDetailsCard({ student }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Guardian Information
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {student.guardians?.map((guardian) => (
                        <div key={guardian.id} className="space-y-4">
                            <div className="font-semibold border-b pb-2">
                                {guardian.relation.charAt(0).toUpperCase() + guardian.relation.slice(1)}
                            </div>
                            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-gray-500">Name</div>
                                    <div className="font-medium">
                                        {guardian.firstName} {guardian.lastName}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Phone</div>
                                    <div className="font-medium">{guardian.phone}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Email</div>
                                    <div className="font-medium">{guardian.email}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Occupation</div>
                                    <div className="font-medium">{guardian.occupation}</div>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-sm text-gray-500">Address</div>
                                    <div className="font-medium">{guardian.address}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {student.guardians?.length === 0 && (
                        <div className="text-gray-500">No guardian information available</div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}