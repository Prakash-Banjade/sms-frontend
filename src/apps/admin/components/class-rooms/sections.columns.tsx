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
import { calculateRatios } from "@/lib/utils"

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
                <span>{row.original.parentClassName}</span>
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
                                admissionFee: row.original.admissionFee,
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
