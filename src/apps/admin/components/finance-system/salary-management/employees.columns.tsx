import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { TEmployees } from "@/apps/admin/types/finance-system/salary-management.types"
import { Link } from "react-router-dom"

export const employeesColumns: ColumnDef<TEmployees['data'][0]>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Employee ID",
        accessorKey: "employeeId",
        cell: ({ row }) => {
            return (
                <Link to={`employee?employeeID=${row.original.employeeId}`} className="hover:underline">
                    {row.original.employeeId}
                </Link>
            )
        }
    },
    {
        header: "Employee Name",
        accessorKey: "fullName",
        cell: ({ row }) => {
            return (
                <Link to={`employee?employeeID=${row.original.employeeId}`} className="hover:underline">
                    {row.original.fullName}
                </Link>
            )
        }
    },
    {
        header: "Designation",
        accessorKey: "designation",
        cell: ({ row }) => <p className="capitalize">{row.original.designation}</p>
    },
    {
        accessorKey: "payAmount",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Pay Amount" />
        },
        cell: ({ row }) => <p className="text-14 font-medium">Rs. {row.original.payAmount?.toLocaleString()} </p>,
    },
]
