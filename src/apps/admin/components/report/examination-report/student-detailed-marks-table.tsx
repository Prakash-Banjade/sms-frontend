import { TExamReportByStudent } from "@/types/examination.type";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ESubjectType } from "@/types/global.type";

export function StudentDetailedMarksTable({ examReport }: { examReport: TExamReportByStudent['examReport'] }) {
    return (
        <Table className="border">
            <TableHeader>
                <TableRow className="border">
                    {/* <TableHead className="border-r" rowSpan={2}>S. Code</TableHead> */}
                    <TableHead className="border-r" rowSpan={2}>Subject</TableHead>
                    <TableHead className="border-r text-center" colSpan={3}>Theory</TableHead>
                    <TableHead className="border-r text-center" colSpan={3}>Practical</TableHead>
                    <TableHead className="border-r" rowSpan={2}>Total</TableHead>
                    <TableHead className="border-r" rowSpan={2}>Percentage</TableHead>
                    <TableHead className="border-r" rowSpan={2}>GPA</TableHead>
                    <TableHead rowSpan={2}>Grade</TableHead>
                </TableRow>
                <TableRow className="border">
                    <TableHead className="border-r">Full</TableHead>
                    <TableHead className="border-r">Pass</TableHead>
                    <TableHead className="border-r">Obt</TableHead>
                    <TableHead className="border-r">Full</TableHead>
                    <TableHead className="border-r">Pass</TableHead>
                    <TableHead className="border-r">Obt</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    examReport?.examSubjects.map(subject => (
                        <TableRow key={subject.id}>
                            {/* <TableCell className="border-r">{subject.subject?.subjectCode}</TableCell> */}
                            <TableCell className="border-r">
                                {
                                    subject.subject?.type === ESubjectType.Optional
                                        ? `O. ${subject.subject?.subjectName}`
                                        : subject.subject?.subjectName
                                }
                            </TableCell>
                            <TableCell className="border-r">{subject.theoryFM}</TableCell>
                            <TableCell className="border-r">{subject.theoryPM}</TableCell>
                            <TableCell className="border-r">{subject.examReports[0]?.theoryOM}</TableCell>
                            <TableCell className="border-r">{subject.practicalFM}</TableCell>
                            <TableCell className="border-r">{subject.practicalPM}</TableCell>
                            <TableCell className="border-r">{subject.examReports[0]?.practicalOM}</TableCell>
                            <TableCell className="border-r">
                                {
                                    !isNaN(subject.examReports[0]?.theoryOM) && !isNaN(subject.examReports[0]?.practicalOM)
                                        ? subject.examReports[0]?.theoryOM + subject.examReports[0]?.practicalOM
                                        : ''
                                }
                            </TableCell>
                            <TableCell className="border-r">{subject.examReports[0]?.percentage && `${subject.examReports[0]?.percentage} %`}</TableCell>
                            <TableCell className="border-r">{subject.examReports[0]?.gpa?.toFixed(2)}</TableCell>
                            <TableCell className="border-r">{subject.examReports[0]?.grade}</TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}