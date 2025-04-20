import { ColumnDef } from "@tanstack/react-table"
import { TStudentsWithLedgerResponse } from "@/apps/admin/types/student.type"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Link } from "react-router-dom"

export const feeStudentsColumns: ColumnDef<TStudentsWithLedgerResponse['data'][0]>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        accessorKey: "studentId",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Student ID" />
        },
        cell: ({ row }) => {
            return <Link to={`student?studentID=${row.original.studentId}`} className="hover:underline">{row.original.studentId}</Link>
        }
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Name" />
        },
        cell: ({ row }) => {
            return <Link to={`student?studentID=${row.original.studentId}`} className="hover:underline">{row.original.fullName}</Link>
        }
    },
    {
        accessorKey: "rollNo",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Roll no." />
        },
    },
    {
        header: "Class",
        accessorKey: "classRoomName",
        cell: ({ row }) => {
            return (
                <p className="whitespace-nowrap">
                    <span>{row.original.classRoomName}</span>
                    <br />
                    <span className="text-muted-foreground text-xs">({row.original.faculty})</span>
                </p>
            )
        }
    },
    {
        accessorKey: "ledgerAmount",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Current Due" />
        },
        cell: ({ row }) => <span>{row.original.ledgerAmount?.toLocaleString()}</span>,
    },

]
