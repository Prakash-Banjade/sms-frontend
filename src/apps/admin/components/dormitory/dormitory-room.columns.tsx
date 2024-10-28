import { ColumnDef } from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuButtonItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Mail, MoreHorizontal, Phone } from "lucide-react"
import { useAppMutation } from "@/hooks/useAppMutation"
import { QueryKey } from "@/react-query/queryKeys"
import { useState } from "react"
import { ResponsiveDialog } from "@/components/ui/responsive-dialog"
import { TDormitoryRoom } from "@/types/dormitory.type"
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import DormitoryRoomForm, { dormitoryRoomFormType } from "./dormitory-room.form"
import { ProfileAvatar } from "@/components/ui/avatar"


export const dormitoryRoomsColumns: ColumnDef<TDormitoryRoom>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Room number",
        accessorKey: "roomNumber"
    },
    {
        header: "Dormitory",
        cell: ({ row }) => {
            return <span>{row.original.dormitory?.name}</span>
        }
    },
    {
        header: "Room Type",
        cell: ({ row }) => {
            return <span>{row.original.roomType?.name}</span>
        }
    },
    {
        header: "No. of Beds",
        accessorKey: "noOfBeds",
    },
    {
        header: "Cost per bed",
        accessorKey: "costPerBed"
    },
    {
        header: "Description",
        accessorKey: "description",
        cell: ({ row }) => {
            if (!row.original.description) return <span>-</span>

            if (row.original.description && row.original.description.length > 100) {
                return <HoverCard openDelay={100} closeDelay={100}>
                    <HoverCardTrigger>
                        <span className="text-14 font-medium break-words max-w-[40ch] line-clamp-3">
                            {row.original.description.slice(0, 100)}...
                        </span>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 break-words">
                        <p className="text-14 font-medium break-words">
                            {row.original.description}
                        </p>
                    </HoverCardContent>
                </HoverCard>
            }

            return <p className="text-14 font-medium break-words max-w-[40ch] line-clamp-3">
                {row.original.description}
            </p>
        },
    },
    {
        header: "Students",
        cell: ({ row }) => {
            return !!row.original.students?.length
                ? <ul className="flex flex-col gap-1">
                    {
                        row.original.students?.map(student => {
                            const studentName = `${student.firstName} ${student.lastName}`

                            return <li key={student.id}>
                                <HoverCard openDelay={100} closeDelay={100}>
                                    <HoverCardTrigger>
                                        <span className="text-14 font-medium break-words max-w-[40ch] line-clamp-3">
                                            {studentName}
                                        </span>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-80">
                                        <div className="flex justify-between space-x-4">
                                            <ProfileAvatar imageUrl={student.profileImage?.url} name={studentName} />
                                            <div className="space-y-1">
                                                <h4 className="text-sm font-semibold">{studentName}</h4>
                                                <p className="text-sm">
                                                    {
                                                        student.classRoom?.parent?.name
                                                            ? `${student.classRoom?.parent?.name} - ${student.classRoom?.name}`
                                                            : student.classRoom?.name
                                                    }
                                                </p>
                                                <div className="flex items-center pt-2">
                                                    <Mail className="mr-2 h-4 w-4 opacity-70" />
                                                    <span className="text-xs text-muted-foreground">
                                                        {student.email}
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Phone className="mr-2 h-4 w-4 opacity-70" />
                                                    <span className="text-xs text-muted-foreground">
                                                        {student.phone}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>
                            </li>
                        })
                    }
                </ul>
                : <span className="text-muted-foreground">**No students**</span>
        }
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const dormitoryRoom = row.original;
            const [isEditOpen, setIsEditOpen] = useState(false);
            const [isDeleteOpen, setIsDeleteOpen] = useState(false);

            const { mutateAsync, isPending } = useAppMutation<dormitoryRoomFormType, any>();

            async function handleDelete() {
                await mutateAsync({
                    method: "delete",
                    endpoint: `${QueryKey.DORMITORY_ROOMS}/${dormitoryRoom.id}`,
                    invalidateTags: [QueryKey.DORMITORY_ROOMS],
                });
            }

            return (
                <>
                    <ResponsiveDialog
                        isOpen={isEditOpen}
                        setIsOpen={setIsEditOpen}
                        title="Edit Dormitory Room"
                        className="w-[97%] max-w-[600px]"
                    >
                        <DormitoryRoomForm
                            dormitoryRoomId={row.original.id}
                            setIsOpen={setIsEditOpen}
                            defaultValues={{
                                costPerBed: row.original.costPerBed,
                                noOfBeds: row.original.noOfBeds,
                                roomNumber: row.original.roomNumber,
                                description: row.original.description,
                                roomTypeId: row.original.roomType?.id,
                                dormitoryId: row.original.dormitory?.id,
                            }}
                        />
                    </ResponsiveDialog>

                    <ResponsiveAlertDialog
                        isOpen={isDeleteOpen}
                        setIsOpen={setIsDeleteOpen}
                        title={`Delete dormitory room?`}
                        description={`Are you sure you want to delete this dormitory room?`}
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
