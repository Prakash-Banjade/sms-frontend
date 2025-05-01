import { formatDate } from "@/utils/format-date"
import { ColumnDef } from "@tanstack/react-table"
import {
    DestructiveDropdownMenuButtonItem,
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
import { Badge } from "@/components/ui/badge"
import { useQueryClient } from "@tanstack/react-query"
import { ELessonPlanStatus, TLessonPlan } from "@/apps/admin/types/lesson-plan.type"
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog"
import { useLocation, useNavigate } from "react-router-dom"

export const lessonPlanColumns: ColumnDef<TLessonPlan>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Title",
        accessorKey: "title",
        cell: ({ row }) => {
            return <p className="truncate font-medium">{row.original.title}</p>
        }
    },
    {
        header: "Subject",
        accessorKey: "Subject Name",
        cell: ({ row }) => {
            return row.original.subject.subjectName;
        }
    },
    {
        header: "Class",
        accessorKey: "class",
        cell: ({ row }) => {
            return (
                <p className="whitespace-nowrap">
                    <span>{row.original.classRoom.fullName}</span>
                    <br />
                    <span className="text-muted-foreground text-xs">({row.original.classRoom.faculty?.name})</span>
                </p>
            )
        }
    },
    {
        header: "Start Date",
        accessorKey: "startDate",
        cell: ({ row }) => <span> {formatDate({
            date: new Date(row.original.startDate)
        })}</span>,
    },
    {
        header: "End Date",
        accessorKey: "endDate",
        cell: ({ row }) => <span > {formatDate({
            date: new Date(row.original.endDate)
        })}</span>,
    },
    {
        header: "Created By",
        accessorKey: "createdBy",
        cell: ({ row }) => {
            const createdBy = row.original.createdBy;

            return (
                <p className="text-14 font-medium"> {createdBy.firstName + ' ' + createdBy.lastName}</p>
            )
        },
    },
    {
        header: "Status",
        accessorKey: "isActive",
        cell: ({ row }) => {
            const status = row.original.status;

            return status === ELessonPlanStatus.Not_Started
                ? <Badge variant="outline" className="whitespace-nowrap">Not Started</Badge>
                : status === ELessonPlanStatus.In_Progress
                    ? <Badge variant="info" className="whitespace-nowrap">In Progress</Badge>
                    : <Badge variant="success" >Completed</Badge>
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const lessonPlan = row.original;
            const [isDeleteOpen, setIsDeleteOpen] = useState(false);
            const queryclient = useQueryClient();
            const navigate = useNavigate();
            const location = useLocation();

            const { mutateAsync, isPending } = useAppMutation();

            async function handleDelete() {
                await mutateAsync({
                    method: "delete",
                    endpoint: `${QueryKey.LESSON_PLANS}/${lessonPlan.id}`,
                    invalidateTags: [QueryKey.LESSON_PLANS],
                });

                queryclient.invalidateQueries({ queryKey: [QueryKey.STUDENTS] })
            }

            return (
                <>
                    <ResponsiveAlertDialog
                        isOpen={isDeleteOpen}
                        setIsOpen={setIsDeleteOpen}
                        title="Delete lesson plan"
                        description="Are you sure you want to delete this lesson plan?"
                        action={() => handleDelete()}
                        actionLabel="Yes, Delete"
                        isLoading={isPending}
                    />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild >
                            <Button variant="ghost" className="h-8 w-8 p-0" >
                                <span className="sr-only" >Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" >
                            <DropdownMenuLabel>Actions </DropdownMenuLabel>
                            <DropdownMenuButtonItem onClick={() => navigate(lessonPlan.id)}>
                                <span>View Details</span>
                            </DropdownMenuButtonItem>
                            <DropdownMenuButtonItem onClick={() => navigate(lessonPlan.id + '/edit', { state: { from: location } })}>
                                <span>Edit </span>
                            </DropdownMenuButtonItem>
                            <DestructiveDropdownMenuButtonItem onClick={() => setIsDeleteOpen(true)}>
                                <span>Delete</span>
                            </DestructiveDropdownMenuButtonItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )
        },
    },
]
