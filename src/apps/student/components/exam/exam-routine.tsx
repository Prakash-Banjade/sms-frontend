import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BookOpen, Calendar, Clock } from 'lucide-react'

const selectedExamType = [
    {
        id: "midterm",
        name: "Midterm Exams",
        exams: [
            { subject: "Mathematics", date: "2023-06-10", time: "09:00 AM", duration: "2 hours" },
            { subject: "English", date: "2023-06-12", time: "10:00 AM", duration: "1.5 hours" },
            { subject: "Science", date: "2023-06-14", time: "09:30 AM", duration: "2 hours" },
            { subject: "History", date: "2023-06-16", time: "11:00 AM", duration: "1.5 hours" },
        ]
    },
]

const ExamRoutine = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle> Schedule</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Duration</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {selectedExamType[0].exams.map((exam, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center">
                                        <BookOpen className="mr-2 h-4 w-4" />
                                        {exam.subject}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {exam.date}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <Clock className="mr-2 h-4 w-4" />
                                        {exam.time}
                                    </div>
                                </TableCell>
                                <TableCell>{exam.duration}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default ExamRoutine
