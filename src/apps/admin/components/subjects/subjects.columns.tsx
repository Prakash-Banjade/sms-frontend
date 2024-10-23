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
import { useState } from "react"
import { ResponsiveDialog } from "@/components/ui/responsive-dialog"
import { classRoomFormSchemaType } from "@/schemas/class-room.schema"
import { TSubject } from "@/types/subject.types"
import SubjectForm from "./subject-form"

export const subjectsColumns: ColumnDef<TSubject>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Subject code",
        accessorKey: "subjectCode",
    },
    {
        header: "Subject name",
        accessorKey: "subjectName",
    },
    {
        header: "Class",
        accessorKey: "classRoom.name",
        cell: ({ row }) => {
            const classroomName = row.original.classRoom?.name;
            return !!row.original?.classRoom
                ? <span>{classroomName}</span>
                : <span className="text-muted-foreground">**Not Assigned**</span>
        }
    },
    {
        header: "Subject teacher",
        accessorKey: "teacher.firstName",
        cell: ({ row }) => {
            const teacherName = row.original.teacher?.firstName + " " + row.original.teacher?.lastName;
            return !!row.original?.teacher
                ? <span>{teacherName}</span>
                : <span className="text-muted-foreground">**Not Assigned**</span>
        }
    },
    {
        header: "Theory full mark",
        accessorKey: "theoryFM",
    },
    {
        header: "Theory pass mark",
        accessorKey: "theoryPM",
    },
    {
        header: "Practical full mark",
        accessorKey: "practicalFM",
    },
    {
        header: "Practical pass mark",
        accessorKey: "practicalPM",
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const classroom = row.original;
            const [isEditOpen, setIsEditOpen] = useState(false);
            // const [isDeleteOpen, setIsDeleteOpen] = useState(false);

            const { mutateAsync } = useAppMutation<classRoomFormSchemaType, any>();

            return (
                <>
                    <ResponsiveDialog
                        isOpen={isEditOpen}
                        setIsOpen={setIsEditOpen}
                        title="Edit class"
                        className="max-w-[800px]"
                    >
                        <SubjectForm
                            subjectId={row.original.id}
                            setIsOpen={setIsEditOpen}
                            defaultValues={{
                                ...row.original,
                                classRoomId: row.original.classRoom?.id,
                                teacherId: row.original.teacher?.id,
                            }}
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
                                <span>Edit</span>
                            </DropdownMenuButtonItem>
                            {/* {
                                !row.original.teacher && <DropdownMenuButtonItem onClick={() => setIsEditOpen(true)}>
                                    <span>Assign Teacher</span>
                                </DropdownMenuButtonItem>
                            }
                            {
                                !row.original.classRoom && <DropdownMenuButtonItem onClick={() => setIsEditOpen(true)}>
                                    <span>Assign Class Room</span>
                                </DropdownMenuButtonItem>
                            } */}
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
