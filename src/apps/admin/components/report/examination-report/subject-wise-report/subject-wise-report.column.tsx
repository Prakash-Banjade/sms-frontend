import { Badge } from "@/components/ui/badge";
import { TExamReportBySubject } from "@/types/examination.type"
import { ColumnDef } from "@tanstack/react-table"

export const subjectWiseReportColumns: ColumnDef<TExamReportBySubject['data'][0]>[] = [
    {
        header: "Roll No.",
        accessorKey: "rollNo",
    },
    {
        header: "Name",
        accessorKey: "fullName",
    },
    {
        header: "Class",
        accessorKey: "classRoomName",
    },
    {
        header: "Obtained Mark",
        accessorKey: "obtainedMarks",
    },
    {
        header: "Percentage",
        accessorKey: "percentage",
    },
    {
        header: "GPA",
        accessorKey: "gpa",
    },
    {
        header: "Grade",
        accessorKey: "grade",
    },
    {
        header: "Status",
        accessorKey: "isActive",
        cell: ({ row }) => {
            const report = row.original;

            return (
                (report.theoryOM < report.passMark)
                    ? <Badge variant={'destructive'}>Failed</Badge>
                    : <Badge variant={'success'}>Passed</Badge>
            )
        },
    }
]