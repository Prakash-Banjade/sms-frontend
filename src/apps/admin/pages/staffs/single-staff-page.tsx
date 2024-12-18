import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Phone, Mail } from "lucide-react"
import { ProfileAvatar } from "@/components/ui/avatar"
import { useParams } from "react-router-dom"
import { getImageUrl } from "@/lib/utils"
import SingleAttendanceView from "../../components/students-management/single-student/single-attendance-view"
import { useGetStaff } from "../../components/staffs/actions"
import PersonalInfoCard, { FinancialInfoCard } from "../../components/teachers/single-teacher/info-cards"
import { Badge } from "@/components/ui/badge"

export default function SingleStaffPage() {
    const params = useParams();

    const { data: staff, isLoading } = useGetStaff({
        id: params.id!,
        options: {
            enabled: !!params.id,
        }
    });

    if (isLoading) return <div>Loading...</div>;

    if (!staff) return <div>No data</div>;

    return (
        <div className="container mx-auto @container space-y-6">
            <div className="grid @5xl:grid-cols-3 grid-cols-1 gap-6">
                <section className="space-y-6 @5xl:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">Staff Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                                <ProfileAvatar name={staff.firstName + ' ' + staff.lastName} src={getImageUrl(staff.profileImage?.url, 'w=200&q=80')} className="size-48" />
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold">{staff.firstName + ' ' + staff.lastName}</h2>
                                    <Badge variant={'outline'} className="capitalize">{staff.type}</Badge>
                                    <p className="text-muted-foreground flex items-center">
                                        <User className="w-4 h-4 mr-2" />
                                        Staff ID: {staff.staffId}
                                    </p>
                                    <p className="text-muted-foreground flex items-center">
                                        <Phone className="w-4 h-4 mr-2" />
                                        {staff.phone}
                                    </p>
                                    <p className="text-muted-foreground flex items-center">
                                        <Mail className="w-4 h-4 mr-2" />
                                        {staff.email}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <PersonalInfoCard employee={{
                        ...staff,
                        profileImageUrl: staff.profileImage?.url ?? null
                    }} />
                    <FinancialInfoCard employee={staff} />
                </section>
                <section className="space-y-6">
                    <SingleAttendanceView accountId={staff.account?.id} employee />
                </section>
            </div>

        </div>
    )
}