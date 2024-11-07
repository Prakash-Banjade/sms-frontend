import { formatDate } from "@/utils/format-date"
import { ColumnDef } from "@tanstack/react-table"

import { TSingleTask } from "@/types/task.type";

export const studentTaskColumn: ColumnDef<TSingleTask>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p> {row.index + 1} </p>,
    },
    {
        header: "Subject",
        accessorKey: "subject",
        cell: ({ row }) => <p>{row.original.subject.subjectName}</p>
    },
    {
        header: "Marks",
        accessorKey: "marks",
        cell: ({ row }) => <p>{row.original.marks || '-'}</p>
    },
    {
        header: "Title",
        accessorKey: "title",
        cell: ({ row }) => {
            return <p>
                {
                    row.original.title?.length > 50 ? `${row.original.title.substring(0, 50)}...` : row.original.title
                }
            </p>
        }
    },
    {
        header: "Submission Date",
        accessorKey: "submissionDate",
        cell: ({ row }) => <p>{formatDate({ date: new Date(row.original.deadline) })}</p>,
    },

]
