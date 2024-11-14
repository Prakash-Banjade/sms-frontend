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
import { TClass } from "@/types/class.type"
import ClassSectionForm from "./class-room-section.form"

export const sectionsColumns: ColumnDef<TClass>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Class name",
        accessorKey: "parentClassName",
    },
    {
        header: "Section name",
        accessorKey: "name",
    },
    {
        header: "Total students",
        accessorKey: "totalStudentsCount",
    },
    {
        header: "Total boys",
        accessorKey: "totalMaleStudentsCount",
        cell: ({ row }) => {
            const percentage = +row.original.totalStudentsCount === 0
                ? 0
                : (+row.original.totalMaleStudentsCount / +row.original.totalStudentsCount) * 100;
            return !percentage ?
                <span>{row.original.totalMaleStudentsCount}</span>
                : <span>
                    {row.original.totalMaleStudentsCount}{" "}
                    <span className="text-muted-foreground text-sm">({Math.round(percentage)}%)</span>
                </span>
        }
    },
    {
        header: "Total girls",
        accessorKey: "totalFemalsStudentsCount",
        cell: ({ row }) => {
            const percentage = +row.original.totalStudentsCount === 0
                ? 0
                : (+row.original.totalFemaleStudentsCount / +row.original.totalStudentsCount) * 100;
            return !percentage ?
                <span>{row.original.totalFemaleStudentsCount}</span>
                : <span>
                    {row.original.totalFemaleStudentsCount}{" "}
                    <span className="text-muted-foreground text-xs">({Math.round(percentage)}%)</span>
                </span>
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
            const [isEditOpen, setIsEditOpen] = useState(false);

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
                            defaultValues={{
                                name: row.original.name,
                                monthlyFee: row.original.monthlyFee,
                                monthlyTutionFee: row.original.monthlyTutionFee,
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
                                <span>Edit section</span>
                            </DropdownMenuButtonItem>
                            {/* <DropdownMenuButtonItem onClick={() => setIsDeleteOpen(true)}>
                                <span>Delete</span>
                            </DropdownMenuButtonItem> */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )
        },
    },
]
