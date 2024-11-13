import { formatDate } from "@/utils/format-date"
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
import { useAppMutation } from "@/hooks/useAppMutation"
import { QueryKey } from "@/react-query/queryKeys"
import { useState } from "react"
import { Task } from "@/types/task.type"
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"

export const taskColumns: ColumnDef<Task>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p> {row.index + 1} </p>,
    },
    {
        header: "Class",
        accessorKey: "class",
        cell: ({ row }) => {
            const task = row.original;

            return (
                <span>
                    {
                        task.parentClassName
                            ? task.parentClassName
                            : task.classRooms?.[0]?.name
                    }
                </span>
            )
        }
    },
    {
        header: "Sections",
        accessorKey: "sections",
        cell: ({ row }) => {
            const task = row.original;

            return (
                <span className="flex gap-2 max-w-[300px] flex-wrap">
                    {
                        (!!task.classRooms?.length && task.parentClassId) ? task.classRooms?.map(classRoom => (
                            <Badge variant={'secondary'} key={classRoom.id}>{classRoom.name}</Badge>
                        )) : '-'
                    }
                </span>
            )
        }
    },
    {
        header: "Subject",
        accessorKey: "subject",
        cell: ({ row }) => <p>{row.original.subjectName}</p>
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
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const task = row.original;
            const navigate = useNavigate();
            const [isDeleteOpen, setIsDeleteOpen] = useState(false);

            const { mutateAsync, isPending } = useAppMutation();

            const handleDelete = async () => {
                await mutateAsync({
                    method: "delete",
                    endpoint: QueryKey.TASKS + `/${task.id}`,
                    invalidateTags: [QueryKey.TASKS],
                });
            };

            return (
                <>
                    <ResponsiveAlertDialog
                        isOpen={isDeleteOpen}
                        setIsOpen={setIsDeleteOpen}
                        title={`Delete Task?`}
                        description="Are you sure you want to delete this task?"
                        action={() => handleDelete()}
                        actionLabel="Yes, Delete"
                        isLoading={isPending}
                    />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuButtonItem onClick={() => navigate(task.id)}>
                                <span>View Details</span>
                            </DropdownMenuButtonItem>
                            <DropdownMenuButtonItem onClick={() => navigate(task.id + '/edit')}>
                                <span>Edit</span>
                            </DropdownMenuButtonItem>
                            <DropdownMenuButtonItem onClick={() => setIsDeleteOpen(true)} className="text-destructive">
                                <span>Delete</span>
                            </DropdownMenuButtonItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )
        },
    },
]
