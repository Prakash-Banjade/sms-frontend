import { TExamResultsResponse } from "@/apps/admin/types/examination.type"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

type Props = {
    data: TExamResultsResponse
}

export default function ClassReportTable({ data }: Props) {
    return (
        <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>S.N.</TableHead>
                    <TableHead>Student</TableHead>
                    {
                        data.examSubjects.map((examSub) => (
                            <TableHead key={examSub.id}>{examSub.subject.subjectName}</TableHead>
                        ))
                    }
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.data.map((result, index) => (
                    <TableRow key={result.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{result.student.firstName} {result.student.lastName}</TableCell>
                        {
                            result.exam.examSubjects.map((examSub) => {
                                const report = examSub.examReports.find((report) => report.id === result.id);
                                
                                return (
                                    <TableCell key={examSub.id}>
                                    </TableCell>
                                )
                            })
                        }
                    </TableRow>
                ))}
            </TableBody>
        </Table>

    )
}