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
import { useNavigate } from "react-router-dom"
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog"
import { TExam } from "@/types/examination.type"
import { format } from "date-fns"

export const examsColumns: ColumnDef<TExam>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Exam Type",
        accessorKey: "examType"
    },
    {
        header: "Class Room",
        accessorKey: "className",
        cell: ({ row }) => {
            return row.original.parentClass
                ? <span>{row.original.parentClass} - {row.original.classRoom}</span>
                : <span>{row.original.classRoom}</span>
        },
    },
    {
        header: "Upcoming Subject",
        accessorKey: "upcomingSubject",
        cell: ({ row }) => {
            return row.original.upcomingSubject
                ? <span>
                    {
                        typeof row.original.upcomingSubject === 'string'
                            ? JSON.parse(row.original.upcomingSubject).subjectName
                            : row.original.upcomingSubject.subjectName
                    }
                </span>
                : <span>N/A</span>
        },
    },
    {
        header: "Exam Date",
        accessorKey: "examDate",
        cell: ({ row }) => {
            return row.original.upcomingSubject
                ? <span>
                    {
                        typeof row.original.upcomingSubject === 'string'
                            ? format(new Date(JSON.parse(row.original.upcomingSubject).examDate), 'dd MMM yyyy')
                            : format(new Date(row.original.upcomingSubject.examDate), 'dd MMM yyyy')
                    }
                </span>
                : <span>N/A</span>
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const navigate = useNavigate();
            const [isDeleteOpen, setIsDeleteOpen] = useState(false);

            const { mutateAsync, isPending } = useAppMutation();

            async function handleDelete() {
                await mutateAsync({
                    method: "delete",
                    endpoint: `${QueryKey.EXAMS}/${row.original.exam_id}`,
                    invalidateTags: [QueryKey.EXAMS],
                });
            }

            return (
                <>
                    <ResponsiveAlertDialog
                        isOpen={isDeleteOpen}
                        setIsOpen={setIsDeleteOpen}
                        title={`Delete exam`}
                        description={`Are you sure you want to delete this exam?`}
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
                            <DropdownMenuButtonItem onClick={() => navigate(row.original.exam_id + '/edit')}>
                                <span>Manage</span>
                            </DropdownMenuButtonItem>
                            <DropdownMenuButtonItem onClick={() => navigate(row.original.exam_id + '/evaluation')}>
                                <span>Evaluation</span>
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
