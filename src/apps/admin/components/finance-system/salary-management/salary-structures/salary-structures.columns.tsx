import { ColumnDef } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuButtonItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { ResponsiveDialog } from "@/components/ui/responsive-dialog"
import { TAllowance, TSalaryStructure } from "@/types/finance-system/salary-management.types"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { TooltipWrapper } from "@/components/ui/tooltip"
import { Link } from "react-router-dom"
import SalaryStructureForm from "./salary-structure.form"

export const salaryStructureColumns: ColumnDef<TSalaryStructure>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Employee ID",
        accessorKey: "employeeId",
    },
    {
        header: "Employee Name",
        accessorKey: "fullName",
        cell: ({ row }) => {
            const employee = row.original;
            const route = (
                employee.teacherId
                    ? 'teachers/'
                    : 'staffs/'
            ) + (employee.teacherId ?? employee.staffId);

            return <TooltipWrapper label="Click to view">
                <Link
                    to={`/admin/${route}`}
                    className="text-14 font-medium hover:underline">
                    {row.original.fullName}
                </Link>
            </TooltipWrapper>
        }
    },
    {
        header: "Designation",
        accessorKey: "designation",
        cell: ({ row }) => <p className="capitalize">{row.original.designation}</p>
    },
    {
        accessorKey: "basicSalary",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Basic Salary" />
        },
        cell: ({ row }) => <p className="text-14 font-medium">Rs. {row.original.basicSalary?.toLocaleString()} </p>,
    },
    {
        accessorKey: "allowances",
        header: "Allowances",
        cell: ({ row }) => {
            const allowances = typeof row.original.allowances === 'string'
                ? JSON.parse(row.original.allowances) as TAllowance[]
                : row.original.allowances;

            return (
                <ul>
                    {allowances.map((allowance, ind) => (
                        <li key={ind}>{allowance.title} <Badge variant={'outline'}>Rs. {allowance.amount}</Badge></li>
                    ))}
                    {allowances.length === 0 && <p className="text-14 font-medium">**None**</p>}
                </ul>
            )
        }
    },
    {
        accessorKey: "grossSalary",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Gross Salary" />
        },
        cell: ({ row }) => <p className="text-14 font-medium">Rs. {row.original.grossSalary?.toLocaleString()} </p>,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const [isEditOpen, setIsEditOpen] = useState(false);

            return (
                <>
                    <ResponsiveDialog
                        isOpen={isEditOpen}
                        setIsOpen={setIsEditOpen}
                        title="Edit salary structure"
                    >
                        <SalaryStructureForm
                            setIsOpen={setIsEditOpen}
                            salaryStructureId={row.original.id}
                            defaultValues={{
                                basicSalary: row.original.basicSalary,
                                allowances: typeof row.original.allowances === 'string'
                                    ? JSON.parse(row.original.allowances)
                                    : row.original.allowances
                            }}
                        />
                    </ResponsiveDialog>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuButtonItem onClick={() => setIsEditOpen(true)}>
                                <span>Edit</span>
                            </DropdownMenuButtonItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )
        },
    },
]
