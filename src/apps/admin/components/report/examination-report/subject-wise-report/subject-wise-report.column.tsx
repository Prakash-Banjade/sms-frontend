import { Badge } from "@/components/ui/badge";
import { TExamReportBySubject } from "@/apps/admin/types/examination.type"
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
        header: "Theory Mark",
        accessorKey: "theoryOM",
    },
    {
        header: "Practical Mark",
        accessorKey: "practicalOM",
    },
    {
        header: "Percentage",
        accessorKey: "percentage",
        cell: ({ row }) => {
            return typeof row.original.percentage
                ? <span>{row.original.percentage} %</span>
                : ''
        }
    },
    {
        header: "GPA",
        accessorKey: "gpa",
        cell: ({ row }) => {
            return typeof row.original.gpa === 'number'
                ? <span>{row.original.gpa.toFixed(2)}</span>
                : ''
        }
    },
    {
        header: "Grade",
        accessorKey: "grade",
    },
    {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => {
            const report = row.original;

            return (
                (report.status === 'FAIL')
                    ? <Badge variant={'destructive'}>Failed</Badge>
                    : <Badge variant={'success'}>Passed</Badge>
            )
        },
    }
]