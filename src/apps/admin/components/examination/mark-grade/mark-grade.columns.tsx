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
import { ResponsiveDialog } from "@/components/ui/responsive-dialog"
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog"
import { TMarkGrade } from "@/types/examination.type"
import MarkGradeForm, { markGradeFormType } from "./mark-grade.form"

export const markGradesColumns: ColumnDef<TMarkGrade>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Grade Name",
        accessorKey: "gradeName",
    },
    {
        header: "Grade Scale",
        accessorKey: "gradeScale",
    },
    {
        header: "Percent From",
        accessorKey: "percentFrom",
    },
    {
        header: "Percent To",
        accessorKey: "percentTo",
    },
    {
        header: "GPA From",
        accessorKey: "gpaFrom",
    },
    {
        header: "GPA To",
        accessorKey: "gpaTo",
    },
    {
        header: "Description",
        accessorKey: "description",
        cell: ({ row }) => {
            return !!row.original.description
                ? <p className="text-14 font-medium break-words max-w-[40ch]">
                    {row.original.description}
                </p> : <span className="text-muted-foreground">-</span>
        }
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const markGrade = row.original;
            const [isEditOpen, setIsEditOpen] = useState(false);
            const [isDeleteOpen, setIsDeleteOpen] = useState(false);

            const { mutateAsync, isPending } = useAppMutation<markGradeFormType, any>();

            async function handleDelete() {
                await mutateAsync({
                    method: "delete",
                    endpoint: `${QueryKey.EXAM_TYPES}/${markGrade.id}`,
                    invalidateTags: [QueryKey.EXAM_TYPES],
                });
            }

            return (
                <>
                    <ResponsiveDialog
                        isOpen={isEditOpen}
                        setIsOpen={setIsEditOpen}
                        title="Edit MarkGrade"
                        className="w-[97%] max-w-[800px]"
                    >
                        <MarkGradeForm markGradeId={row.original.id} setIsOpen={setIsEditOpen} defaultValues={markGrade} />
                    </ResponsiveDialog>

                    <ResponsiveAlertDialog
                        isOpen={isDeleteOpen}
                        setIsOpen={setIsDeleteOpen}
                        title={`Delete markGrade "${markGrade.gradeName}"`}
                        description={`Are you sure you want to delete this exam type?`}
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
                            <DropdownMenuButtonItem onClick={() => setIsEditOpen(true)}>
                                <span>Edit</span>
                            </DropdownMenuButtonItem>
                            <DropdownMenuButtonItem className="text-destructive" onClick={() => setIsDeleteOpen(true)}>
                                <span>Delete</span>
                            </DropdownMenuButtonItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )
        },
    },
]
