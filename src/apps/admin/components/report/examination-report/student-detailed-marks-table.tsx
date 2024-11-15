import { TExamReportByStudent } from "@/types/examination.type";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ESubjectType } from "@/types/global.type";

export function StudentDetailedMarksTable({ examReport }: { examReport: TExamReportByStudent['examReport'] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead rowSpan={2}>S. Code</TableHead>
                    <TableHead rowSpan={2}>Subject</TableHead>
                    <TableHead colSpan={3}>Theory</TableHead>
                    <TableHead colSpan={3}>Practical</TableHead>
                    <TableHead rowSpan={2}>Total</TableHead>
                    <TableHead rowSpan={2}>Percentage</TableHead>
                    <TableHead rowSpan={2}>GPA</TableHead>
                    <TableHead rowSpan={2}>Grade</TableHead>
                </TableRow>
                <TableRow>
                    <TableHead>Full</TableHead>
                    <TableHead>Pass</TableHead>
                    <TableHead>Obt</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    examReport?.examSubjects.map(subject => (
                        <TableRow key={subject.id}>
                            <TableCell>{subject.subject?.subjectCode}</TableCell>
                            <TableCell>
                                {
                                    subject.subject?.type === ESubjectType.Optional
                                        ? `O. ${subject.subject?.subjectName}`
                                        : subject.subject?.subjectName
                                }
                            </TableCell>
                            <TableCell>{subject.theoryFM}</TableCell>
                            <TableCell>{subject.theoryPM}</TableCell>
                            <TableCell>{subject.examReports[0]?.theoryOM}</TableCell>
                            <TableCell>{subject.practicalFM}</TableCell>
                            <TableCell>{subject.practicalPM}</TableCell>
                            <TableCell>{subject.examReports[0]?.practicalOM}</TableCell>
                            <TableCell>{subject.examReports[0]?.percentage && `${subject.examReports[0]?.percentage} %`}</TableCell>
                            <TableCell>{subject.examReports[0]?.gpa?.toFixed(2)}</TableCell>
                            <TableCell>{subject.examReports[0]?.grade}</TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}