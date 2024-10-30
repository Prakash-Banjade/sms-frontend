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

export const taskColumns: ColumnDef<Task>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Title",
        accessorKey: "title",
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
                            ? task.parentClassName + ' - ' + task.classRoomName
                            : task.classRoomName
                    }
                </span>
            )
        }
    },
    {
        header: "Submission Date",
        accessorKey: "submissionDate",
        cell: ({ row }) => <p className="text-14 font-medium">{formatDate({ date: new Date(row.original.submissionDate) })}</p>,
    },
    {
        header: "Marks",
        accessorKey: "marks",
        cell: ({ row }) => <p className="text-14 font-medium">{row.original.marks || '-'}</p>
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
