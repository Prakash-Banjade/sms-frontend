import { useState } from 'react'
import { Calendar, MessageSquare, PieChart, Users } from 'lucide-react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for the income vs expense chart
const financialData = [
    { month: 'Jan', income: 50000, expense: 30000 },
    { month: 'Feb', income: 55000, expense: 35000 },
    { month: 'Mar', income: 60000, expense: 40000 },
    { month: 'Apr', income: 58000, expense: 38000 },
    { month: 'May', income: 62000, expense: 42000 },
    { month: 'Jun', income: 65000, expense: 45000 },
]

// Mock data for academic calendar events
const initialEvents = [
    { id: 1, title: 'Parent-Teacher Meeting', date: '2024-05-15' },
    { id: 2, title: 'Annual Sports Day', date: '2024-06-10' },
    { id: 3, title: 'Summer Break Starts', date: '2024-07-01' },
]

export function AdminDashboard() {
    const [events, setEvents] = useState(initialEvents)
    const [newEvent, setNewEvent] = useState({ title: '', date: '' })

    const addEvent = () => {
        if (newEvent.title && newEvent.date) {
            setEvents([...events, { ...newEvent, id: events.length + 1 }])
            setNewEvent({ title: '', date: '' })
        }
    }

    return (
        <div className="flex flex-1 flex-col overflow-hidden">

            {/* Dashboard Content */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,234</div>
                        <p className="text-xs text-muted-foreground">+10% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">56</div>
                        <p className="text-xs text-muted-foreground">+2 new this month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                        <PieChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">32</div>
                        <p className="text-xs text-muted-foreground">Across all grades</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">95%</div>
                        <p className="text-xs text-muted-foreground">Last 30 days average</p>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
                {/* Income vs Expense Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Income vs Expense</CardTitle>
                        <CardDescription>Monthly financial overview</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                income: {
                                    label: "Income",
                                    color: "hsl(var(--chart-1))",
                                },
                                expense: {
                                    label: "Expense",
                                    color: "hsl(var(--chart-2))",
                                },
                            }}
                            className="h-[300px]"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={financialData}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="income" fill="var(--color-income)" />
                                    <Bar dataKey="expense" fill="var(--color-expense)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Academic Calendar */}
                <Card>
                    <CardHeader>
                        <CardTitle>Academic Calendar</CardTitle>
                        <CardDescription>Upcoming events and schedules</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex space-x-2">
                                <Input
                                    placeholder="Event title"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                />
                                <Input
                                    type="date"
                                    value={newEvent.date}
                                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                />
                                <Button onClick={addEvent}>Add Event</Button>
                            </div>
                            <ul className="space-y-2">
                                {events.map((event) => (
                                    <li key={event.id} className="flex justify-between">
                                        <span>{event.title}</span>
                                        <span className="text-muted-foreground">{event.date}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activities */}
            <Card className="mt-6">
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
        </div>
    )
}