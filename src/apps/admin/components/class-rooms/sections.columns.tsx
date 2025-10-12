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
import { useState } from "react"
import { ResponsiveDialog } from "@/components/ui/responsive-dialog"
import { TClass } from "@/apps/admin/types/class.type"
import ClassSectionForm from "./class-room-section.form"
import { calculateRatios } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-provider"
import { useNavigate } from "react-router-dom"
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog"
import { useAppMutation } from "@/hooks/useAppMutation"
import { QueryKey } from "@/react-query/queryKeys"
import { Role } from "@/types/global.type"
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams"

export const sectionsColumns: ColumnDef<TClass>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Class name",
        accessorKey: "parentClassName",
        cell: ({ row }) => {
            return <p className="whitespace-nowrap">
                <span className="font-medium">{row.original.parentClassName}</span>
                <br />
                <span className="text-muted-foreground text-xs">({row.original.faculty})</span>
            </p>
        }
    },
    {
        header: "Section name",
        accessorKey: "name",
    },
    {
        header: "Total students",
        accessorKey: "totalStudentsCount",
        cell: ({ row }) => {
            const section = row.original;
            const ratio = calculateRatios(
                +section.totalStudentsCount,
                +section.totalMaleStudentsCount,
                +section.totalFemaleStudentsCount,
                (+section.totalStudentsCount - +section.totalMaleStudentsCount - +section.totalFemaleStudentsCount)
            );

            return (
                <div className="space-y-1">
                    <div className="text-sm text-muted-foreground" title="Students Count">
                        Males: {section.totalMaleStudentsCount} •
                        Females: {section.totalFemaleStudentsCount} •
                        Others: {+section.totalStudentsCount - +section.totalMaleStudentsCount - +section.totalFemaleStudentsCount}
                    </div>
                    <div className="font-medium">
                        <span title="Total students count">Total: {section.totalStudentsCount}</span> &nbsp;
                        <span className="font-normal text-muted-foreground" title="Ratio - Males : Females : Others">
                            ({`${ratio[0]} : ${ratio[1]} : ${ratio[2]}`})
                        </span>
                    </div>
                </div>
            )
        }
    },
    {
        header: "Class Teacher",
        accessorKey: "classTeacherName",
        cell: ({ row }) => <span>{row.original.classTeacherName || <span className="text-muted-foreground">"N/A"</span>}</span>,
    },
    {
        header: "Location",
        accessorKey: "location",
        cell: ({ row }) => {
            return !!row.original.location
                ? <span>{row.original.location}</span>
                : <span className="text-muted-foreground">**Not Available**</span>
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const { searchParams, setSearchParams } = useCustomSearchParams();
            const [isEditOpen, setIsEditOpen] = useState(false);
            const [isDeleteOpen, setIsDeleteOpen] = useState(searchParams.get('delete') === row.original.id);
            const navigate = useNavigate();
            const { payload } = useAuth();
            const [isUpdateRollNumberOpen, setIsUpdateRollNumberOpen] = useState(false);

            const { mutateAsync, isPending } = useAppMutation();

            async function handleUpdateRollNumber() {
                await mutateAsync({
                    method: "patch",
                    endpoint: `class-rooms/${row.original.id}/update-roll-no`,
                    invalidateTags: [QueryKey.CLASSES],
                });
            }

            async function handleDelete() {
                await mutateAsync({
                    method: "delete",
                    endpoint: `class-rooms/${row.original.id}`,
                    invalidateTags: [QueryKey.CLASSES],
                });

                setSearchParams('delete', undefined);
            }

            return (
                <>
                    <ResponsiveDialog
                        isOpen={isEditOpen}
                        setIsOpen={setIsEditOpen}
                        title="Edit class"
                    >
                        <ClassSectionForm
                            classRoomId={row.original.id}
                            setIsOpen={setIsEditOpen}
                            facultyId={row.original.facultyId}
                            defaultValues={{
                                name: row.original.name,
                                location: row.original.location,
                                classTeacherId: row.original.classTeacherId
                            }}
                            selectedClassTeacherOption={
                                (row.original.classTeacherId && row.original.classTeacherName)
                                    ? { value: row.original.classTeacherId, label: row.original.classTeacherName }
                                    : undefined
                            }
                        />
                    </ResponsiveDialog>

                    <ResponsiveAlertDialog
                        action={handleUpdateRollNumber}
                        isOpen={isUpdateRollNumberOpen}
                        setIsOpen={setIsUpdateRollNumberOpen}
                        title="Update Roll Number Alphabetically"
                        description="Are you sure you want to update the roll number for all students in this class? This will rearrange the roll numbers alphabetically."
                        actionLabel="Yes, Update"
                        isLoading={isPending}
                        loadingText="Updating..."
                    />


                    <ResponsiveAlertDialog
                        action={handleDelete}
                        isOpen={isDeleteOpen}
                        setIsOpen={setIsDeleteOpen}
                        title={`Delete section "${row.original.name}" from class ${row.original.parentClassName}?`}
                        description="Are you sure you want to delete this section? This will also delete all the data associated with this class including students records."
                        actionLabel="Yes, Delete"
                        isLoading={isPending}
                        loadingText="Deleting..."
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
                            <DropdownMenuButtonItem onClick={() => navigate(`/${payload?.role}/students?facultyId=${row.original.facultyId}&classRoomId=${row.original.parentClassId}&sectionId=${row.original.id}`)}>
                                <span>View All Students</span>
                            </DropdownMenuButtonItem>
                            <DropdownMenuButtonItem onClick={() => setIsEditOpen(true)}>
                                <span>Edit section</span>
                            </DropdownMenuButtonItem>
                            <DropdownMenuButtonItem onClick={() => setIsUpdateRollNumberOpen(true)}>
                                <span>Update Roll Numbers</span>
                            </DropdownMenuButtonItem>
                            {
                                payload?.role === Role.SUPER_ADMIN && (
                                    <DestructiveDropdownMenuButtonItem onClick={() => navigate(`${row.original.id}/delete`)}>
                                        <span>Delete</span>
                                    </DestructiveDropdownMenuButtonItem>

                                )
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )
        },
    },
]
