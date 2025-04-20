import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TExamSubject_Raw } from '@/apps/admin/types/examination.type'
import { format, parse } from "date-fns";

type Props = {
    data: TExamSubject_Raw[]
}

const ExamRoutine = ({ data: subjects }: Props) => {
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
                            <TableHead>Exam Date</TableHead>
                            <TableHead>Start Time</TableHead>
                            <TableHead>Duration</TableHead>
                            {/* <TableHead>Full Mark</TableHead>
                    <TableHead>Pass Mark</TableHead> */}
                            <TableHead>Venue</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subjects?.map((examSubject) => (
                            <TableRow key={examSubject.id}>
                                <TableCell className="font-medium">{examSubject?.subjectName}</TableCell>
                                <TableCell>{new Date(examSubject.examDate).toDateString()}</TableCell>
                                <TableCell>{format(parse(examSubject.startTime, "HH:mm", new Date()), "hh:mm a")}</TableCell>
                                <TableCell>{examSubject.duration} Minutes</TableCell>
                                {/* <TableCell>{examSubject.fullMark}</TableCell>
                        <TableCell>{examSubject.passMark}</TableCell> */}
                                <TableCell>{examSubject.venue}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default ExamRoutine
