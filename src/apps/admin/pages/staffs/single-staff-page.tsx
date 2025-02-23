import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Phone, Mail } from "lucide-react"
import { ProfileAvatar } from "@/components/ui/avatar"
import { useParams } from "react-router-dom"
import { getImageUrl } from "@/lib/utils"
import SingleAttendanceView from "../../components/students-management/single-student/single-attendance-view"
import { useGetStaff } from "../../components/staffs/actions"
import PersonalInfoCard, { FinancialInfoCard } from "../../components/teachers/single-teacher/info-cards"
import { Badge } from "@/components/ui/badge"
import { useEffect } from "react"
import { useSidebar } from "@/components/ui/sidebar"

export default function SingleStaffPage() {
    const params = useParams();
    const { setDynamicBreadcrumb } = useSidebar();

    const { data: staff, isLoading } = useGetStaff({
        id: params.id!,
        options: {
            enabled: !!params.id,
        }
    });

    useEffect(() => {
        if (staff) {
            setDynamicBreadcrumb([
                {
                    label: staff?.firstName + ' ' + staff?.lastName,
                    url: `/teachers/${staff?.id}`,
                }
            ]);
        }
    }, [staff]);

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
                        <CardContent className="@container/parent">
                            <div className="flex flex-col @xl/parent:flex-row items-center @5xl/parent:items-start @xl/parent:items-center space-y-4 @xl/parent:space-y-0 @xl/parent:space-x-6">
                                <ProfileAvatar
                                    name={staff.firstName + ' ' + staff.lastName}
                                    src={getImageUrl(staff.account?.profileImage?.url, 'w=200&q=80')}
                                    className="@xl/parent:size-48 @lg/parent:size-40 @sm/parent:size-36 size-28 text-4xl"
                                    style={{
                                        boxShadow: `
                                        0 0 0 3px hsl(var(--card)),   
                                        0 0 0 5px hsl(var(--primary)) 
                                    `
                                    }}
                                />
                                <div className="flex flex-col gap-2 items-center @xl/parent:items-start">
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
                        profileImageUrl: staff.account?.profileImage?.url ?? null
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