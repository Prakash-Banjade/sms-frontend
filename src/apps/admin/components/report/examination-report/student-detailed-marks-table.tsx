import { TExamReportByStudent } from "@/types/examination.type";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ESubjectType } from "@/types/global.type";

export function StudentDetailedMarksTable({ examReport }: { examReport: TExamReportByStudent['examReport'] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Full Mark</TableHead>
                    <TableHead>Pass Marks</TableHead>
                    <TableHead>Obtained Marks</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>GPA</TableHead>
                    <TableHead>Grade</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    examReport?.examSubjects.map(subject => (
                        <TableRow key={subject.id}>
                            <TableCell>
                                {
                                    subject.subject?.type === ESubjectType.Optional
                                        ? `O. ${subject.subject?.subjectName}`
                                        : subject.subject?.subjectName
                                }
                            </TableCell>
                            <TableCell>{subject.fullMark}</TableCell>
                            <TableCell>{subject.passMark}</TableCell>
                            <TableCell>{subject.examReports[0]?.obtainedMarks}</TableCell>
                            <TableCell>{subject.examReports[0]?.percentage} %</TableCell>
                            <TableCell>{subject.examReports[0]?.gpa?.toFixed(2)}</TableCell>
                            <TableCell>{subject.examReports[0]?.grade}</TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}