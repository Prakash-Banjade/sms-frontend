import { TeacherDashboard } from "@/apps/admin/types/dashboard.type";
import DashboardCountCard from "@/components/dashboard/dashboard-count-card";
import ContainerLayout from "@/components/page-layouts/container-layout"
import { useAuth } from "@/contexts/auth-provider"
import { useFetchData } from "@/hooks/useFetchData";
import { QueryKey } from "@/react-query/queryKeys";
import { Building, NotepadText, UserX, WalletMinimal } from "lucide-react";
import TodayScheduleCard from "../components/dashboard/today-schedule-card";
import UpcommingEvents from "@/apps/admin/components/dashboard/upcomming-events";
import RecentNotices from "@/apps/admin/components/dashboard/recent-notices";
import TodayBirthDays from "@/apps/admin/components/dashboard/today-birthdays";
import { ELeaveRequestStatus } from "@/types/global.type";

export default function TeacherDashboardPage() {
    const { payload } = useAuth();

    return (
        <ContainerLayout
            title={greeting() + ", " + payload?.firstName + " " + payload?.lastName + "!"}
            description="Here's an overview of your teaching activities and upcoming tasks."
        >
            <section className="@container space-y-6">
                <DashboardStatistics />
                <section className="grid grid-cols-1 @4xl:gap-x-6 gap-y-6 @4xl:grid-cols-3">
                    <section className="col-span-2">
                        <TodayScheduleCard />
                    </section>
                    <section className='@container'>
                        <section className='grid @5xl:grid-cols-2 grid-cols-1 gap-6'>
                            <UpcommingEvents />
                            <RecentNotices />
                            <TodayBirthDays />
                        </section>
                    </section>
                </section>
            </section>

        </ContainerLayout>
    )
}

function DashboardStatistics() {
    const { data, isLoading } = useFetchData<TeacherDashboard>({
        endpoint: QueryKey.DASHBOARD + '/teacher',
        queryKey: [QueryKey.DASHBOARD, 'teacher'],
    })

    return (
        <section className="@container">
            <div className="grid grid-cols-1 @lg:grid-cols-2 @2xl:grid-cols-3 @5xl:grid-cols-4 gap-4">
                <DashboardCountCard
                    title="Total Classes"
                    count={data?.totalClasses || 0}
                    icon={Building}
                    footer={"Class Teacher or Subject Teacher"}
                    isLoading={isLoading}
                    navigateTo="/teacher/my-classes"
                />
                <DashboardCountCard
                    title="Pending Assignments"
                    count={data?.pendingAssignments || 0}
                    icon={NotepadText}
                    footer={"Assignments to be reviewed"}
                    isLoading={isLoading}
                    navigateTo="/teacher/tasks/assignments"
                />
                <DashboardCountCard
                    title="Pending Leave Requests"
                    count={data?.pendingLeaveRequests || 0}
                    icon={UserX}
                    footer={"Leave requests to be reviewed"}
                    isLoading={isLoading}
                    navigateTo={`/teacher/attendance/leave-requests?status=${ELeaveRequestStatus.PENDING}`}
                />
                <DashboardCountCard
                    title="Remaining Salary"
                    count={`Rs. ${(data?.teacherPayAmount || 0).toLocaleString()}`}
                    icon={WalletMinimal}
                    isLoading={isLoading}
                    navigateTo="/teacher/salary"
                />
            </div>
        </section>
    )
}

function greeting() {
    const day = new Date().getHours()
    if (day >= 5 && day < 12) return "Good Morning"
    if (day >= 12 && day < 18) return "Good Afternoon"
    return "Good Evening"
}