import { PieChart, Users, Users2 } from 'lucide-react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardCountCard from '@/components/dashboard/dashboard-count-card'
import { AcademicYearCalendar } from '../components/dashboard/academic-events-calendar'
import { useGetAdminDashboard } from '../data-access/dashboard-data-access'
import Dashboard_LeaveRequests from '../components/dashboard/leave-requests'
import { useAuth } from '@/contexts/auth-provider'
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import TodayBirthDays from '../components/dashboard/today-birthdays'
import UpcommingEvents from '../components/dashboard/upcomming-events'
import RecentNotices from '../components/dashboard/recent-notices'

const financeData = Array.from({ length: 12 }).map((_, i) => ({
    month: i + 1,
    income: 2700 + Math.random() * 900,
    expense: 1800 + Math.random() * 900,
}))

const chartConfig = {
    income: {
        label: "Income",
        color: "hsl(var(--chart-1))",
    },
    expense: {
        label: "Expense",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

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
                            <ChartContainer config={chartConfig} className='w-full h-auto'>
                                <LineChart
                                    accessibilityLayer
                                    data={financeData}
                                    margin={{
                                        left: 12,
                                        right: 12,
                                    }}
                                >
                                    <CartesianGrid vertical={false} />
                                    <YAxis />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) => value}
                                    />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                    <ChartLegend content={<ChartLegendContent />} />
                                    <Line
                                        dataKey="income"
                                        type="monotone"
                                        stroke="hsl(var(--success))"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                    <Line
                                        dataKey="expense"
                                        type="monotone"
                                        stroke="hsl(var(--destructive))"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card className='mt-6'>
                        <CardContent className='p-6'>
                            <AcademicYearCalendar />
                        </CardContent>
                    </Card>

                </section>

                <section className='@container/parent'>
                    <section className='grid @5xl/parent:grid-cols-2 grid-cols-1 gap-6'>
                        <Dashboard_LeaveRequests />
                        <UpcommingEvents />
                        <RecentNotices />
                        <TodayBirthDays />
                    </section>
                </section>
            </div>
        </div >
    )
}