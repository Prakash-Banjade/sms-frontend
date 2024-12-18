import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Phone, Mail, School } from "lucide-react"
import { ProfileAvatar } from "@/components/ui/avatar"
import { useFetchData } from "@/hooks/useFetchData"
import { TSingleTeacherDetail } from "@/types/teacher.type"
import { useParams } from "react-router-dom"
import { QueryKey } from "@/react-query/queryKeys"
import { getImageUrl } from "@/lib/utils"
import PersonalInfoCard, { FinancialInfoCard } from "../../components/teachers/single-teacher/info-cards"
import SingleAttendanceView from "../../components/students-management/single-student/single-attendance-view"
import TeacherClassSchecule from "../../components/teachers/single-teacher/teacher-class-schedule"

export default function SingleTeacherPage() {
    const params = useParams();

    const { data: teacher, isLoading } = useFetchData<TSingleTeacherDetail>({
        endpoint: QueryKey.TEACHERS + '/' + params.id! + '/details',
        queryKey: [QueryKey.TEACHERS, params.id!],
        options: { enabled: !!params.id }
    });

    if (isLoading) return <div>Loading...</div>;

    if (!teacher) return <div>No data</div>;

    return (
        <div className="container mx-auto @container space-y-6">
            <div className="grid @5xl:grid-cols-3 grid-cols-1 gap-6">
                <section className="space-y-6 @5xl:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">Teacher Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                                <ProfileAvatar name={teacher.fullName} src={getImageUrl(teacher.profileImageUrl, 'w=200&q=80')} className="size-48" />
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold">{teacher.fullName}</h2>
                                    <p className="text-muted-foreground flex items-center">
                                        <User className="w-4 h-4 mr-2" />
                                        Teacher ID: {teacher.teacherId}
                                    </p>
                                    <p className="text-muted-foreground flex items-center">
                                        <Phone className="w-4 h-4 mr-2" />
                                        {teacher.phone}
                                    </p>
                                    <p className="text-muted-foreground flex items-center">
                                        <Mail className="w-4 h-4 mr-2" />
                                        {teacher.email}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <PersonalInfoCard employee={teacher} />
                    <FinancialInfoCard employee={teacher} />
                </section>
                <section className="space-y-6">
                    <SingleAttendanceView accountId={teacher.accountId} employee />
                    <Card>
                        <CardHeader>
                            <CardTitle>Assigned Classes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {
                                    teacher.assignedClassRooms?.filter(Boolean)?.length
                                        ? teacher.assignedClassRooms?.filter(Boolean)?.map((cls, index) => (
                                            <Badge key={index} variant="secondary">
                                                <School className="w-4 h-4 mr-2 inline" />
                                                {cls}
                                            </Badge>
                                        ))
                                        : <span className="text-muted-foreground">No class assigned</span>
                                }
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>

            <TeacherClassSchecule />
        </div>
    )
}