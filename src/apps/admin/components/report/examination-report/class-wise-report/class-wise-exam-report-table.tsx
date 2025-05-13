import { TExamResultsResponse } from "@/apps/admin/types/examination.type"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import React from "react"

type Props = {
    data: TExamResultsResponse
}

export const ClassWiseExamReportTable = React.forwardRef<HTMLTableElement, Props>(({ data }, ref) => {
    return (
        <Table className="border" ref={ref}>
            <TableHeader>
                <TableRow>
                    <TableHead className="border" rowSpan={2}>S.N.</TableHead>
                    <TableHead className="border" rowSpan={2}>Student</TableHead>
                    {
                        data.examSubjects.map((examSub) => (
                            <TableHead key={examSub.id} colSpan={3} className="text-center border">{examSub.subject.subjectName}</TableHead>
                        ))
                    }
                    <TableHead className="border whitespace-nowrap" rowSpan={2}>G. Total</TableHead>
                    <TableHead className="border" rowSpan={2}>Percentage</TableHead>
                    <TableHead className="border" rowSpan={2}>GPA</TableHead>
                    <TableHead className="border" rowSpan={2}>Grade</TableHead>
                </TableRow>
                <TableRow>
                    {
                        data.examSubjects.map((examSub) => (
                            <>
                                <TableHead key={examSub.id} className="border">Th.</TableHead>
                                <TableHead key={examSub.id} className="border">Pr.</TableHead>
                                <TableHead key={examSub.id} className="border">Total</TableHead>
                            </>
                        ))
                    }
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.data.map((result, index) => {
                    const grandTotal = result.exam.examSubjects.reduce((acc, sub) => {
                        const report = sub.examReports[0];
                        return acc + (report?.theoryOM || 0) + (report?.practicalOM || 0)
                    }, 0);

                    const isFail = result.exam.examSubjects.some((sub) => {
                        const report = sub.examReports[0];
                        if (!report) return false;

                        const examSubject = data.examSubjects.find((examSub) => examSub.id === sub.id);
                        if (!examSubject) return false;
                        return report.theoryOM < examSubject?.theoryPM || report.practicalOM < examSubject?.practicalPM;
                    });

                    return (
                        <TableRow key={result.id}>
                            <TableCell className="font-medium border">
                                {index + 1}
                                {isFail && <span className="text-red-500">*</span>}
                            </TableCell>
                            <TableCell className="font-medium border whitespace-nowrap">{result.student.firstName} {result.student.lastName}</TableCell>
                            {
                                data.examSubjects.map((examSub) => {
                                    const report = result.exam.examSubjects.find((sub) => sub.id === examSub.id)?.examReports[0];

                                    return (
                                        <>
                                            <TableCell key={examSub.id} className="border">
                                                {
                                                    report ? (
                                                        <div>
                                                            <span>{report.theoryOM}</span>
                                                            {report.theoryOM < examSub.theoryPM && (
                                                                <span className="text-red-500">*</span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">N/A</span>
                                                    )
                                                }
                                            </TableCell>
                                            <TableCell key={examSub.id} className="border">
                                                {
                                                    report ? (
                                                        <div>
                                                            <span>{report.practicalOM}</span>
                                                            {report.practicalOM < examSub.practicalPM && (
                                                                <span className="text-red-500">*</span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">N/A</span>
                                                    )
                                                }
                                            </TableCell>
                                            <TableCell key={examSub.id} className="border">
                                                {
                                                    report ? (
                                                        <span>
                                                            {
                                                                !isNaN(report?.theoryOM) && !isNaN(report?.practicalOM)
                                                                    ? report?.theoryOM + report?.practicalOM
                                                                    : ''
                                                            }
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground">N/A</span>
                                                    )
                                                }
                                            </TableCell>
                                        </>
                                    )
                                })
                            }
                            <TableCell className="border">{grandTotal}</TableCell>
                            <TableCell className="border">{result.percentage}%</TableCell>
                            <TableCell className="border">{result.gpa}</TableCell>
                            <TableCell className="border">{result.grade}</TableCell>
                        </TableRow>
                    )
                })
                }
            </TableBody>
        </Table>

    )
})