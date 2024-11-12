import { Calendar, MessageSquare, PieChart, Users, Users2 } from 'lucide-react'
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardCountCard from '@/components/dashboard/dashboard-count-card'
import { AcademicYearCalendar } from '../components/dashboard/academic-events-calendar'
import { useGetAdminDashboard } from '../data-access/dashboard-data-access'

const financeData = Array.from({ length: 12 }).map((_, i) => ({
    month: i + 1,
    income: 2700 + Math.random() * 900,
    expense: 1800 + Math.random() * 900,
}))

export function AdminDashboard() {
    const { data: dashboard, isLoading } = useGetAdminDashboard({});

    return (
        <div className='@container'>
            <div className="grid @5xl:grid-cols-3 grid-cols-1 gap-6">
                <section className='@5xl:col-span-2'>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <DashboardCountCard title="Total Students" count={dashboard?.studentsCount} icon={Users} isLoading={isLoading} />
                        <DashboardCountCard title="Total Teachers" count={dashboard?.teachersCount} icon={Users} isLoading={isLoading} />
                        <DashboardCountCard title="Total Classrooms" count={dashboard?.classRoomsCount} icon={PieChart} isLoading={isLoading} />
                        <DashboardCountCard title="Total Staffs" count={dashboard?.staffsCount} icon={Users2} isLoading={isLoading} />
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

                {/* Recent Activities */}
                <section className='space-y-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activities</CardTitle>
                            <CardDescription>Latest updates and notifications</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                <li className="flex items-center">
                                    <span className="mr-2 rounded-full bg-blue-500 p-2 text-white">
                                        <Users className="h-4 w-4" />
                                    </span>
                                    <div>
                                        <p className="font-medium">New student enrolled</p>
                                        <p className="text-sm text-muted-foreground">John Doe joined 10th grade</p>
                                    </div>
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2 rounded-full bg-green-500 p-2 text-white">
                                        <Calendar className="h-4 w-4" />
                                    </span>
                                    <div>
                                        <p className="font-medium">Exam schedule updated</p>
                                        <p className="text-sm text-muted-foreground">Final exams start from June 15th</p>
                                    </div>
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2 rounded-full bg-yellow-500 p-2 text-white">
                                        <MessageSquare className="h-4 w-4" />
                                    </span>
                                    <div>
                                        <p className="font-medium">New announcement</p>
                                        <p className="text-sm text-muted-foreground">School picnic scheduled for next month</p>
                                    </div>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Announcements</CardTitle>
                            <CardDescription>Latest updates and notifications</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                <li className="flex items-center">
                                    <span className="mr-2 rounded-full bg-blue-500 p-2 text-white">
                                        <Users className="h-4 w-4" />
                                    </span>
                                    <div>
                                        <p className="font-medium">New student enrolled</p>
                                        <p className="text-sm text-muted-foreground">John Doe joined 10th grade</p>
                                    </div>
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2 rounded-full bg-green-500 p-2 text-white">
                                        <Calendar className="h-4 w-4" />
                                    </span>
                                    <div>
                                        <p className="font-medium">Exam schedule updated</p>
                                        <p className="text-sm text-muted-foreground">Final exams start from June 15th</p>
                                    </div>
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2 rounded-full bg-yellow-500 p-2 text-white">
                                        <MessageSquare className="h-4 w-4" />
                                    </span>
                                    <div>
                                        <p className="font-medium">New announcement</p>
                                        <p className="text-sm text-muted-foreground">School picnic scheduled for next month</p>
                                    </div>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    )
}