import { ColumnDef } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuButtonItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { ResponsiveDialog } from "@/components/ui/responsive-dialog"
import { TClass } from "@/apps/admin/types/class.type"
import ClassRoomForm from "./class-room.form"
import ClassSectionForm from "./class-room-section.form"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { calculateRatios } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-provider"
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog"
import { useAppMutation } from "@/hooks/useAppMutation"
import { QueryKey } from "@/react-query/queryKeys"

export const classesColumns: ColumnDef<TClass>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Class name",
        accessorKey: "name",
        cell: ({ row }) => {
            return <p className="whitespace-nowrap">
                <span>{row.original.name}</span>
                <br />
                <span className="text-muted-foreground text-xs">({row.original.faculty})</span>
            </p>
        }
    },
    {
        header: "Total students",
        accessorKey: "totalStudentsCount",
        cell: ({ row }) => {
            const classRoom = row.original;
            const ratio = calculateRatios(
                +classRoom.totalStudentsCount,
                +classRoom.totalMaleStudentsCount,
                +classRoom.totalFemaleStudentsCount,
                (+classRoom.totalStudentsCount - +classRoom.totalMaleStudentsCount - +classRoom.totalFemaleStudentsCount)
            );

            return (
                <div className="space-y-1 whitespace-nowrap">
                    <div className="text-sm text-muted-foreground" title="Students Count">
                        Males: {classRoom.totalMaleStudentsCount} •
                        Females: {classRoom.totalFemaleStudentsCount} •
                        Others: {+classRoom.totalStudentsCount - +classRoom.totalMaleStudentsCount - +classRoom.totalFemaleStudentsCount}
                    </div>
                    <div className="font-medium">
                        <span title="Total students count">Total: {classRoom.totalStudentsCount}</span> &nbsp;
                        <span className="font-normal text-muted-foreground" title="Ratio - Males : Females : Others">
                            ({`${ratio[0]} : ${ratio[1]} : ${ratio[2]}`})
                        </span>
                    </div>
                </div>
            )
        }
    },
    {
        header: "Class Teachers",
        accessorKey: "classTeacherName",
        cell: ({ row }) => {
            const teachersArrayParsed = typeof row.original.childClassTeachers === 'string'
                ? JSON.parse(row.original.childClassTeachers)
                : row.original.childClassTeachers;

            const teachersArray = Array.isArray(teachersArrayParsed)
                ? teachersArrayParsed?.map((teacher) => (
                    <span key={teacher.className}>{teacher.teacherName} <Badge variant={"outline"} className="whitespace-nowrap" title="Section">{teacher.className}</Badge></span>
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
            const { payload } = useAuth();
            const [isEditOpen, setIsEditOpen] = useState(false);
            const [isSectionFormOpen, setIsSectionFormOpen] = useState(false);
            const [isUpdateRollNumberOpen, setIsUpdateRollNumberOpen] = useState(false);

            const { mutateAsync, isPending } = useAppMutation();

            async function handleUpdateRollNumber() {
                await mutateAsync({
                    method: "patch",
                    endpoint: `class-rooms/${row.original.id}/update-roll-no`,
                    invalidateTags: [QueryKey.CLASSES],
                });
            }

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
                                facultyId: row.original.facultyId, // mock to pass the schema, not neede for backend
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
                            facultyId={row.original.facultyId}
                            parentClassId={row.original.id}
                            setIsOpen={setIsSectionFormOpen}
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
                                <span>View Full Details</span>
                            </DropdownMenuButtonItem>
                            <DropdownMenuButtonItem onClick={() => navigate(`/${payload?.role}/students?facultyId=${row.original.facultyId}&classRoomId=${row.original.id}`)}>
                                <span>View All Students</span>
                            </DropdownMenuButtonItem>
                            <DropdownMenuButtonItem onClick={() => setIsEditOpen(true)}>
                                <span>Edit Class</span>
                            </DropdownMenuButtonItem>
                            <DropdownMenuButtonItem onClick={() => setIsSectionFormOpen(true)}>
                                <span>Add Section</span>
                            </DropdownMenuButtonItem>
                            <DropdownMenuButtonItem onClick={() => setIsUpdateRollNumberOpen(true)}>
                                <span>Update Roll Numbers</span>
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
