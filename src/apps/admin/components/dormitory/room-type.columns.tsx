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
import { TRoomType } from "@/apps/admin/types/dormitory.type"
import RoomTypeForm, { roomTypeFormType } from "./room-type.form"
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog"

export const roomTypesColumns: ColumnDef<TRoomType>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Name",
        accessorKey: "name",
        cell: ({ row }) => <p className="font-medium">{row.original.name}</p>,
    },
    {
        header: "Description",
        accessorKey: "description",
        cell: ({ row }) => <p className="max-w-[50ch] wrap-break-word">{row.original.description}</p>,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const roomType = row.original;
            const [isEditOpen, setIsEditOpen] = useState(false);
            const [isDeleteOpen, setIsDeleteOpen] = useState(false);

            const { mutateAsync, isPending } = useAppMutation<roomTypeFormType, any>();

            async function handleDelete() {
                await mutateAsync({
                    method: "patch",
                    endpoint: `${QueryKey.ROOM_TYPES}/${roomType.id}`,
                    invalidateTags: [QueryKey.ROOM_TYPES],
                });
            }

            return (
                <>
                    <ResponsiveDialog
                        isOpen={isEditOpen}
                        setIsOpen={setIsEditOpen}
                        title="Edit Room Type"
                    >
                        <RoomTypeForm roomTypeId={row.original.id} setIsOpen={setIsEditOpen} defaultValues={row.original} />
                    </ResponsiveDialog>

                    <ResponsiveAlertDialog
                        isOpen={isDeleteOpen}
                        setIsOpen={setIsDeleteOpen}
                        title={`Delete room type "${roomType.name}"`}
                        description={`Are you sure you want to delete this room type?`} 
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
