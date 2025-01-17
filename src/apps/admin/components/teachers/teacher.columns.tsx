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
import { Teacher } from "@/types/teacher.type"
import { TooltipWrapper } from "@/components/ui/tooltip"
import { formatDate } from "@/utils/format-date"
import { calculateExactAge } from "@/utils/calculate-age"
import { ProfileAvatar } from "@/components/ui/avatar"
import { getImageUrl } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export const teachersColumns: ColumnDef<Teacher>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Teacher ID",
        accessorKey: "teacherId",
    },
    {
        header: "Name",
        accessorKey: "teacherFullName",
        cell: ({ row }) => {
            return <TooltipWrapper label={'Click to view'}>
                <Link to={row.original.id} className="hover:text-blue-500 hover:underline flex gap-4 items-center">
                    <ProfileAvatar
                        name={row.original.firstName + ' ' + row.original.lastName}
                        src={getImageUrl(row.original.profileImage?.url, "w=40")}
                        className="size-10"
                    />
                    {row.original.firstName + ' ' + row.original.lastName}
                </Link>
            </TooltipWrapper>
        }
    },
    {
        header: "Gender",
        accessorKey: "gender",
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
        header: "Date of Birth",
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
        header: "Joined Date",
        cell: ({ row }) => {
            return <span>
                {formatDate({ date: new Date(row.original.joinedDate) })}
            </span>
        }
    },
    {
        header: "Department",
        accessorKey: "faculties",
        cell: ({ row }) => {
            const faculties = row.original.faculties;

            if (faculties.length === 0) return <p className="text-center text-muted-foreground">N/A</p>;

            return (
                <ul>
                    {faculties.map((faculty) => (
                        <li key={faculty.id}>
                            <Badge className="capitalize whitespace-nowrap" variant={'outline'}>{faculty.name}</Badge>
                        </li>
                    ))}
                </ul>
            )
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
