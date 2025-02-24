import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Users, GraduationCap, Book, Award, Clock } from "lucide-react"
import { ProfileAvatar } from "@/components/ui/avatar"
import ClassDetailsCard from "../../components/class-rooms/single-classroom/class-details-card"
import ClassRoomAttendanceChart from "../../components/class-rooms/single-classroom/class-room-attendance-chart"
import { ClassDetailsLoadingSkeleton } from "../../components/class-rooms/single-classroom/skeletons/class-details-card-skeleton"
import { useGetClass } from "../../components/class-rooms/actions"
import { useParams } from "react-router-dom"
import SingleClassSectionsList from "../../components/class-rooms/single-classroom/single-class-sections-list"
import { useEffect } from "react"
import { useSidebar } from "@/components/ui/sidebar"

// Extended mock data for the class
const classData = {
    name: "Class 10",
    totalStudents: 120,
    maleCount: 65,
    femaleCount: 55,
    classTeacher: "Mr. John Doe",
    sections: [
        { name: "A", totalStudents: 40 },
        { name: "B", totalStudents: 38 },
        { name: "C", totalStudents: 42 },
    ],
    attendanceData: [
        { date: '2023-01-01', attendance: 95 },
        { date: '2023-01-02', attendance: 92 },
        { date: '2023-01-03', attendance: 98 },
        { date: '2023-01-04', attendance: 90 },
        { date: '2023-01-05', attendance: 95 },
        { date: '2023-01-06', attendance: 88 },
        { date: '2023-01-07', attendance: 93 },
    ],
    academicPerformance: {
        averageScore: 78,
        highestScore: 98,
        lowestScore: 45
    },
    topPerformers: [
        { name: "Alice Johnson", score: 98, avatar: "/placeholder.svg" },
        { name: "Bob Smith", score: 96, avatar: "/placeholder.svg" },
        { name: "Charlie Brown", score: 95, avatar: "/placeholder.svg" }
    ],
    classSchedule: [
        { day: "Monday", subjects: ["Mathematics", "Science", "English", "History"] },
        { day: "Tuesday", subjects: ["Physics", "Chemistry", "Literature", "Physical Education"] },
        { day: "Wednesday", subjects: ["Biology", "Computer Science", "Art", "Geography"] },
        { day: "Thursday", subjects: ["Mathematics", "Language", "Social Studies", "Music"] },
        { day: "Friday", subjects: ["Science", "English", "Economics", "Civics"] }
    ],
    extracurricularActivities: [
        { name: "Debate Club", participants: 15 },
        { name: "Science Olympiad", participants: 20 },
        { name: "Sports Team", participants: 25 },
        { name: "Art Club", participants: 18 }
    ],
    classAchievements: [
        "1st Place in Inter-School Science Fair",
        "Best Class Performance Award",
        "100% Pass Rate in National Exams"
    ],
    ageDistribution: [
        { age: 15, count: 45 },
        { age: 16, count: 60 },
        { age: 17, count: 15 }
    ],
    classResources: [
        { subject: "Mathematics", textbook: "Advanced Algebra by John Smith" },
        { subject: "Science", textbook: "Comprehensive Sciences by Emily Brown" },
        { subject: "English", textbook: "Modern Literature by William Johnson" },
        { subject: "History", textbook: "World History by Sarah Davis" }
    ]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function SingleClassRoomPage() {
    const params = useParams();
    const { setDynamicBreadcrumb } = useSidebar();

    const { data: classRoom, isLoading } = useGetClass({ id: params.id! }); // this component is used in a dynamic route, so used not null

    useEffect(() => {
        if (classRoom) {
            console.log(1)
            setDynamicBreadcrumb([
                {
                    label: classRoom.name,
                    url: `/classes/${classRoom.id}`,
                }
            ]);
        }
    }, [classRoom]);

    if (!classRoom && !isLoading) return <div>Class not found</div>;

    return (
        <div className="container mx-auto @container space-y-8">
            {
                isLoading
                    ? <ClassDetailsLoadingSkeleton />
                    : <ClassDetailsCard classRoom={classRoom} />
            }

            {
                classRoom && (<SingleClassSectionsList classRoomId={params.id!} facultyId={classRoom?.facultyId} />)
            }

            <ClassRoomAttendanceChart />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Academic Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span>Average Score</span>
                                    <span>{classData.academicPerformance.averageScore}%</span>
                                </div>
                                <Progress value={classData.academicPerformance.averageScore} />
                            </div>
                            <div className="flex justify-between">
                                <span>Highest Score: {classData.academicPerformance.highestScore}%</span>
                                <span>Lowest Score: {classData.academicPerformance.lowestScore}%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Top Performers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {classData.topPerformers.map((student, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <ProfileAvatar src={student.avatar} name={student.name} className="size-10" />
                                        <span className="ml-2">{student.name}</span>
                                    </div>
                                    <Badge variant="secondary">{student.score}%</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold flex items-center">
                            <Clock className="mr-2 h-5 w-5" />
                            Class Schedule
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Day</TableHead>
                                    <TableHead>Subjects</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {classData.classSchedule.map((day, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{day.day}</TableCell>
                                        <TableCell>{day.subjects.join(", ")}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold flex items-center">
                            <Award className="mr-2 h-5 w-5" />
                            Class Achievements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-2">
                            {classData.classAchievements.map((achievement, index) => (
                                <li key={index}>{achievement}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold flex items-center">
                            <Users className="mr-2 h-5 w-5" />
                            Age Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={classData.ageDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                        label={({ name, percent }) => `${name} years (${(percent * 100).toFixed(0)}%)`}
                                    >
                                        {classData.ageDistribution.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold flex items-center">
                            <GraduationCap className="mr-2 h-5 w-5" />
                            Extracurricular Activities
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Activity</TableHead>
                                    <TableHead className="text-right">Participants</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {classData.extracurricularActivities.map((activity, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{activity.name}</TableCell>
                                        <TableCell className="text-right">{activity.participants}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold flex items-center">
                            <Book className="mr-2 h-5 w-5" />
                            Class Resources
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Textbook</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {classData.classResources.map((resource, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{resource.subject}</TableCell>
                                        <TableCell>{resource.textbook}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}