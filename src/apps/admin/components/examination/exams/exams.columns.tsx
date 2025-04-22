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
import { TExam } from "@/apps/admin/types/examination.type"
import { Badge } from "@/components/ui/badge"

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
            return row.original.classRoom;
        },
    },
    {
        header: "Faculty",
        accessorKey: "faculty",
    },
    {
        header: "Result Status",
        accessorKey: "isReportPublished",
        cell: ({ row }) => {
            return row.original.isReportPublished ? <Badge variant="success">Published</Badge> : <Badge variant="outline">Not Published</Badge>;
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const navigate = useNavigate();
            const [isDeleteOpen, setIsDeleteOpen] = useState(false);
            const [isPublishOpen, setIsPublishOpen] = useState(false);

            const { mutateAsync, isPending } = useAppMutation();

            async function handleDelete() {
                await mutateAsync({
                    method: "delete",
                    endpoint: `${QueryKey.EXAMS}/${row.original.id}`,
                    invalidateTags: [QueryKey.EXAMS],
                });
            }

            async function handlePublishResult() {
                await mutateAsync({
                    method: "patch",
                    endpoint: `${QueryKey.EXAMS}/${row.original.id}/publish?publish=${!row.original.isReportPublished}`,
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

                    <ResponsiveAlertDialog
                        isOpen={isPublishOpen}
                        setIsOpen={setIsPublishOpen}
                        title={`Publish exam results`}
                        description={`Are you sure you want to publish the exam results?`}
                        action={() => handlePublishResult()}
                        actionLabel="Yes, Publish"
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
                            <DropdownMenuButtonItem onClick={() => navigate(row.original.id + '/edit' + '?classRoomId=' + row.original.classRoomId + '&examTypeId=' + row.original.examTypeId)}>
                                <span>Manage</span>
                            </DropdownMenuButtonItem>
                            <DropdownMenuButtonItem onClick={() => navigate(row.original.id + '/evaluation')}>
                                <span>Evaluation</span>
                            </DropdownMenuButtonItem>
                            {
                                row.original.isReportPublished
                                    ? (
                                        <DropdownMenuButtonItem onClick={() => handlePublishResult()}>
                                            <span>Unpublish Result</span>
                                        </DropdownMenuButtonItem>
                                    ) : (
                                        <DropdownMenuButtonItem onClick={() => setIsPublishOpen(true)}>
                                            <span>Publish Result</span>
                                        </DropdownMenuButtonItem>
                                    )
                            }
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
