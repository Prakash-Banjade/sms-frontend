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
import ClassRoomForm from "./class-room.form"
import ClassSectionForm from "./class-room-section.form"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"

export const classesColumns: ColumnDef<TClass>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Class name",
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
        accessorKey: "totalFemaleStudentsCount",
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
        cell: ({ row }) => {
            const teachersArrayParsed = typeof row.original.childClassTeachers === 'string'
                ? JSON.parse(row.original.childClassTeachers)
                : row.original.childClassTeachers;

            const teachersArray = Array.isArray(teachersArrayParsed)
                ? teachersArrayParsed?.map((teacher) => (
                    <span key={teacher.className}>{teacher.teacherName} <Badge variant={"outline"}>{teacher.className}</Badge></span>
                )) : [];

            return <ul className="flex flex-col gap-1">
                {
                    row.original.classTeacherName && <li>{row.original.classTeacherName}</li>
                }
                {
                    teachersArray.map((teacher, index) => (
                        <li key={index}>{teacher}</li>
                    ))
                }
                {
                    teachersArray.length === 0 && !row.original.classTeacherName && <li className="text-muted-foreground">N/A</li>
                }
            </ul>
        },
    },
    {
        header: "Monthly fee",
        accessorKey: "monthlyFee",
        cell: ({ row }) => row.original.monthlyFee?.toLocaleString()
    },
    {
        header: "Monthly tution fee",
        accessorKey: "monthlyTutionFee",
        cell: ({ row }) => row.original.monthlyTutionFee?.toLocaleString()
    },
    {
        header: "Location",
        accessorKey: "location",
        cell: ({ row }) => {
            return !!row.original.location
                ? <span>{row.original.location}</span>
                : <span className="text-muted-foreground">N/A</span>
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const navigate = useNavigate();
            const [isEditOpen, setIsEditOpen] = useState(false);
            const [isSectionFormOpen, setIsSectionFormOpen] = useState(false);

            return (
                <>
                    <ResponsiveDialog
                        isOpen={isEditOpen}
                        setIsOpen={setIsEditOpen}
                        title="Edit class"
                        className="w-[97%] max-w-[800px]"
                    >
                        <ClassRoomForm
                            classRoomId={row.original.id}
                            setIsOpen={setIsEditOpen}
                            defaultValues={{
                                ...row.original,
                                classTeacherId: row.original.classTeacherId,
                            }}
                            selectedClassTeacherOption={
                                (row.original.classTeacherId && row.original.classTeacherName)
                                    ? { value: row.original.classTeacherId, label: row.original.classTeacherName }
                                    : undefined
                            }
                        />
                    </ResponsiveDialog>
                    <ResponsiveDialog
                        isOpen={isSectionFormOpen}
                        setIsOpen={setIsSectionFormOpen}
                        title="Add Section"
                    >
                        <ClassSectionForm
                            parentClassId={row.original.id}
                            setIsOpen={setIsSectionFormOpen}
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
                            <DropdownMenuButtonItem onClick={() => navigate(row.original.id)}>
                                <span>View full detail</span>
                            </DropdownMenuButtonItem>
                            <DropdownMenuButtonItem onClick={() => setIsEditOpen(true)}>
                                <span>Edit class</span>
                            </DropdownMenuButtonItem>
                            <DropdownMenuButtonItem onClick={() => setIsSectionFormOpen(true)}>
                                <span>Add section</span>
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
