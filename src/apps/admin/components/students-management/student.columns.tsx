import { ColumnDef } from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuButtonItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { TooltipWrapper } from "@/components/ui/tooltip"
import { formatDate } from "@/utils/format-date"
import { calculateExactAge } from "@/utils/calculate-age"
import { TStudent } from "@/types/student.type"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { ProfileAvatar } from "@/components/ui/avatar"


export const studentsColumns: ColumnDef<TStudent>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        accessorKey: "studentId",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Student ID" />
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Name" />
        },
        cell: ({ row }) => {
            return <TooltipWrapper label={'Click to view'}>
                <Link to={`/admin/students/${row.original.id}`} className="hover:text-blue-500 hover:underline flex gap-4 items-center">
                    <ProfileAvatar name={row.original.fullName} src={row.original.profileImageUrl || ''} className="size-10" />
                    {row.original.fullName}
                </Link>
            </TooltipWrapper>
        }
    },
    {
        header: "Class",
        cell: ({ row }) => {
            const student = row.original;

            return <span>
                {
                    student.parentClass ? `${student.parentClass} - ${student.classRoom}` : `${student.classRoom}`
                }
            </span>
        }
    },
    {
        accessorKey: "rollNo",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Roll no." />
        },
    },
    {
        accessorKey: "gender",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Gender" />
        },
        cell: ({ row }) => {
            return <span className="capitalize">{row.original.gender}</span>
        },
    },
    {
        header: "Email",
        accessorKey: "email",
        cell: ({ row }) => {
            return <TooltipWrapper label={'Click to send mail'}>
                <a href={`mailto:${row.original.email}`} className="hover:text-blue-500 hover:underline">{row.original.email}</a>
            </TooltipWrapper>
        },
    },
    {
        header: "Phone",
        accessorKey: "phone",
        cell: ({ row }) => {
            return <TooltipWrapper label={'Click to call'}>
                <a href={`tel:${row.original.phone}`} className="hover:text-blue-500 hover:underline">{row.original.phone}</a>
            </TooltipWrapper>
        }
    },
    {
        accessorKey: "dob",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Date of birth" />
        },
        cell: ({ row }) => {
            return <span>
                {formatDate({ date: new Date(row.original.dob) })}&nbsp;
                <span className="text-xs text-muted-foreground">
                    ({calculateExactAge(new Date(row.original.dob))} Y)
                </span>
            </span>
        }
    },
    {
        accessorKey: "routeStop",
        header: "Transport Route stop",
        cell: ({ row }) => {
            return row.original.routeStop ? <span>{row.original.routeStop}</span> : <span className="text-muted-foreground">-</span>
        }
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const navigate = useNavigate();

            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuButtonItem onClick={() => navigate(`${row.original.id}/edit`)}>
                                <span>Edit</span>
                            </DropdownMenuButtonItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )
        },
    },
]
