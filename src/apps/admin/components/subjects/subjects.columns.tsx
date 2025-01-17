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
import { useState } from "react"
import { ResponsiveDialog } from "@/components/ui/responsive-dialog"
import { TSubject } from "@/types/subject.type"
import SubjectForm from "./subject-form"
import { Link } from "react-router-dom"
import { TooltipWrapper } from "@/components/ui/tooltip"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-provider"

export const subjectsColumns: ColumnDef<TSubject>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Subject code",
        accessorKey: "subjectCode",
    },
    {
        accessorKey: "subjectName",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Subject Name" />
        },
        cell: ({ row }) => {
            return (
                <TooltipWrapper label="Click to view">
                    <Link to={`${row.original.id}`} className="hover:underline hover:text-blue-500">
                        <span>{row.original.subjectName}</span>
                    </Link>
                </TooltipWrapper>
            )
        }
    },
    {
        header: "Class",
        accessorKey: "classRoom.name",
        cell: ({ row }) => {
            return <p className="whitespace-nowrap">
                <span>{row.original.classRoom?.name}</span>
                <br />
                <span className="text-muted-foreground text-xs">({row.original.classRoom?.faculty?.name})</span>
            </p>
        }
    },
    {
        header: "Subject teachers",
        accessorKey: "teachers",
        cell: ({ row }) => {
            const { payload } = useAuth();

            return row.original.teachers?.length > 0 ? <ul>
                {row.original.teachers.map((t) => (
                    <li key={t.id}>
                        <Badge variant={'outline'} className="whitespace-nowrap">
                            <Link to={`/${payload?.role}/teachers/${t.id}`} className="hover:underline">
                                {t.firstName} {t.lastName}
                            </Link>
                        </Badge>
                    </li>
                ))}
            </ul> : <p className="text-muted-foreground text-center">N/A</p>
        }
    },
    {
        header: "Subject type",
        accessorKey: "subjectType",
        cell: ({ row }) => {
            return <span className="capitalize">{row.original.type}</span>
        }
    },
    {
        header: "Theory full mark",
        accessorKey: "theoryFM",
    },
    {
        header: "Theory pass mark",
        accessorKey: "theoryPM",
    },
    {
        header: "Practical full mark",
        accessorKey: "practicalFM",
    },
    {
        header: "Practical pass mark",
        accessorKey: "practicalPM",
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
                        title="Edit Subject"
                        className="max-w-[800px]"
                    >
                        <SubjectForm
                            subjectId={row.original.id}
                            setIsOpen={setIsEditOpen}
                            defaultValues={{
                                ...row.original,
                                classRoomId: row.original.classRoom?.id,
                                teacherIds: row.original.teachers.map((t) => t.id),
                            }}
                            selectedTeachers={row.original.teachers?.map(t => ({
                                label: `${t.firstName} ${t.lastName}`,
                                value: t.id
                            }))}
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
