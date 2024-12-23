import { PieChart, Users, Users2 } from 'lucide-react'
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardCountCard from '@/components/dashboard/dashboard-count-card'
import { AcademicYearCalendar } from '../components/dashboard/academic-events-calendar'
import { useGetAdminDashboard } from '../data-access/dashboard-data-access'
import Dashboard_LeaveRequests from '../components/dashboard/leave-requests'
import { useAuth } from '@/contexts/auth-provider'

const financeData = Array.from({ length: 12 }).map((_, i) => ({
    month: i + 1,
    income: 2700 + Math.random() * 900,
    expense: 1800 + Math.random() * 900,
}))

export default function AdminDashboard() {
    const { data: dashboard, isLoading } = useGetAdminDashboard({});
    const { payload } = useAuth();

    return (
        <div className='@container'>
            <div className="grid @7xl:grid-cols-3 grid-cols-1 gap-6">
                <section className='@7xl:col-span-2'>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <DashboardCountCard title="Total Students" count={dashboard?.studentsCount} icon={Users} isLoading={isLoading} navigateTo={`/${payload?.role}/students`} />
                        <DashboardCountCard title="Total Teachers" count={dashboard?.teachersCount} icon={Users} isLoading={isLoading} navigateTo={`/${payload?.role}/teachers`} />
                        <DashboardCountCard title="Total Classrooms" count={dashboard?.classRoomsCount} icon={PieChart} isLoading={isLoading} footer='Including sections' navigateTo={`/${payload?.role}/classes`} />
                        <DashboardCountCard title="Total Staffs" count={dashboard?.staffsCount} icon={Users2} isLoading={isLoading} navigateTo={`/${payload?.role}/staffs`} />
                    </div>

                    {/* Income vs Expense Chart */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Income vs Expense</CardTitle>
                            <CardDescription>Monthly financial overview</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={financeData}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="income" stroke="hsl(var(--success))" name="Income" />
                                    <Line type="monotone" dataKey="expense" stroke="hsl(var(--destructive))" name="Expense" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <section className='mt-6'>
                        <AcademicYearCalendar />
                    </section>

                </section>

                <Dashboard_LeaveRequests />
            </div>
        </div>
    )
}