import { PieChart, Users, Users2 } from 'lucide-react'
import DashboardCountCard from '@/components/dashboard/dashboard-count-card'
import { AcademicYearCalendar } from '../components/dashboard/academic-events-calendar'
import { useGetAdminDashboard } from '../data-access/dashboard-data-access'
import Dashboard_LeaveRequests from '../components/dashboard/leave-requests'
import { useAuth } from '@/contexts/auth-provider'
import TodayBirthDays from '../components/dashboard/today-birthdays'
import UpcommingEvents from '../components/dashboard/upcomming-events'
import RecentNotices from '../components/dashboard/recent-notices'
import Dashboard_IncomeExpenseChart from '../components/dashboard/income-expense-chart'

export default function AdminDashboard() {
    const { data: dashboard, isLoading } = useGetAdminDashboard({});
    const { payload } = useAuth();

    return (
        <div className='@container/main'>
            <div className="grid @7xl/main:grid-cols-3 grid-cols-1 gap-6">
                <section className='@7xl/main:col-span-2'>

                    <section className='@container'>
                        <div className="grid gap-6 @sm:grid-cols-2 @4xl:grid-cols-4">
                            <DashboardCountCard title="Total Students" count={dashboard?.studentsCount} icon={Users} isLoading={isLoading} navigateTo={`/${payload?.role}/students`} />
                            <DashboardCountCard title="Total Teachers" count={dashboard?.teachersCount} icon={Users} isLoading={isLoading} navigateTo={`/${payload?.role}/teachers`} />
                            <DashboardCountCard title="Total Classrooms" count={dashboard?.classRoomsCount} icon={PieChart} isLoading={isLoading} footer='Including sections' navigateTo={`/${payload?.role}/classes`} />
                            <DashboardCountCard title="Total Staffs" count={dashboard?.staffsCount} icon={Users2} isLoading={isLoading} navigateTo={`/${payload?.role}/staffs`} />
                        </div>
                    </section>

                    <section className="mt-6">
                        <Dashboard_IncomeExpenseChart />
                    </section>

                    <section className="mt-6">
                        <AcademicYearCalendar />
                    </section>

                </section>

                <section className='@container'>
                    <section className='grid @5xl:grid-cols-2 grid-cols-1 gap-6'>
                        <Dashboard_LeaveRequests />
                        <UpcommingEvents />
                        <RecentNotices />
                        <TodayBirthDays />
                    </section>
                </section>
            </div>
            <div className='h-10' />
        </div>
    )
}