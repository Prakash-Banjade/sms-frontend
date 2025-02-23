import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Phone, Mail } from "lucide-react"
import { ProfileAvatar } from "@/components/ui/avatar"
import { useFetchData } from "@/hooks/useFetchData"
import { SingleTeacherAssignedclass, TSingleTeacherDetail } from "@/types/teacher.type"
import { useParams } from "react-router-dom"
import { QueryKey } from "@/react-query/queryKeys"
import { getImageUrl } from "@/lib/utils"
import PersonalInfoCard, { FinancialInfoCard } from "../../components/teachers/single-teacher/info-cards"
import SingleAttendanceView from "../../components/students-management/single-student/single-attendance-view"
import TeacherClassSchecule from "../../components/teachers/single-teacher/teacher-class-schedule"
import { useEffect } from "react"
import { useSidebar } from "@/components/ui/sidebar"

export default function SingleTeacherPage() {
    const params = useParams();
    const { setDynamicBreadcrumb } = useSidebar();

    const { data: teacher, isLoading } = useFetchData<TSingleTeacherDetail>({
        endpoint: QueryKey.TEACHERS + '/' + params.id! + '/details',
        queryKey: [QueryKey.TEACHERS, params.id!, 'details'],
        options: { enabled: !!params.id }
    });

    useEffect(() => {
        setDynamicBreadcrumb([
            {
                label: teacher?.fullName ?? '',
                url: `/teachers/${teacher?.id}`,
            }
        ]);
    }, [teacher]);

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
                        <CardContent className="@container/parent">
                            <div className="flex flex-col @xl/parent:flex-row items-center @5xl/parent:items-start @xl/parent:items-center space-y-4 @xl/parent:space-y-0 @xl/parent:space-x-6">
                                <ProfileAvatar
                                    name={teacher.fullName}
                                    src={getImageUrl(teacher.profileImageUrl, 'w=200&q=80')}
                                    className="@xl/parent:size-48 @lg/parent:size-40 @sm/parent:size-36 size-28 text-4xl"
                                    style={{
                                        boxShadow: `
                                        0 0 0 3px hsl(var(--card)),   
                                        0 0 0 5px hsl(var(--primary)) 
                                    `
                                    }}
                                />
                                <div className="flex flex-col gap-2 items-center @xl/parent:items-start">
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
                            <AssignedClassRoomsContent classes={teacher.assignedClassRooms} />
                        </CardContent>
                    </Card>
                </section>
            </div>

            <TeacherClassSchecule />
        </div>
    )
}

const AssignedClassRoomsContent = ({ classes }: { classes: TSingleTeacherDetail["assignedClassRooms"] }) => {
    const classesArray = (
        typeof classes === 'string'
            ? JSON.parse(classes) as SingleTeacherAssignedclass[]
            : classes
    ).filter(cls => !!cls.classRoomName && !!cls.facultyName);

    return (
        <ul className="flex flex-wrap gap-3 flex-col">
            {
                classesArray.length > 0
                    ? classesArray.map((cls, index) => (
                        <li key={index} className="list-disc list-inside">
                            {cls?.classRoomName} <span className="text-muted-foreground text-sm">({cls?.facultyName})</span>
                        </li>
                    ))
                    : <span className="text-muted-foreground">No class assigned!</span>
            }
        </ul>
    )
}