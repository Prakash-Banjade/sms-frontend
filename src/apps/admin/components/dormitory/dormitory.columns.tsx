import { ColumnDef } from "@tanstack/react-table"
import { DestructiveDropdownMenuButtonItem, DropdownMenu, DropdownMenuButtonItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { useAppMutation } from "@/hooks/useAppMutation"
import { QueryKey } from "@/react-query/queryKeys"
import { useState } from "react"
import { ResponsiveDialog } from "@/components/ui/responsive-dialog"
import { TDormitory } from "@/apps/admin/types/dormitory.type"
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog"
import DormitoryForm from "./dormitory.form"

export const dormitoriesColumns: ColumnDef<TDormitory>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Name",
        accessorKey: "name",
        cell: ({ row }) => <p className="font-medium"> {row.original.name} </p>,
    },
    {
        header: "Type",
        accessorKey: "type",
        cell: ({ row }) => {
            return <span className="capitalize">{row.original.type}</span>
        },
    },
    {
        header: "Address",
        accessorKey: "address",
        cell: ({ row }) => <p className="text-14">
            {
                !!row.original.address
                    ? row.original.address
                    : <span>-</span>
            }
        </p>
    },
    {
        header: "Intake",
        accessorKey: "intake",
        cell: ({ row }) => <p className="text-14">
            {
                !!row.original.intake
                    ? row.original.intake
                    : <span>-</span>
            }
        </p>
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const dormitory = row.original;
            const [isEditOpen, setIsEditOpen] = useState(false);
            const [isDeleteOpen, setIsDeleteOpen] = useState(false);

            const { mutateAsync, isPending } = useAppMutation();

            async function handleDelete() {
                await mutateAsync({
                    method: "delete",
                    endpoint: `${QueryKey.DORMITORY}/${dormitory.id}`,
                    invalidateTags: [QueryKey.DORMITORY],
                });
            }

            return (
                <>
                    <ResponsiveDialog
                        isOpen={isEditOpen}
                        setIsOpen={setIsEditOpen}
                        title="Edit Dormitory"
                        className="w-[97%] max-w-[800px]"
                    >
                        <DormitoryForm dormitoryId={row.original.id} setIsOpen={setIsEditOpen} defaultValues={row.original} />
                    </ResponsiveDialog>

                    <ResponsiveAlertDialog
                        isOpen={isDeleteOpen}
                        setIsOpen={setIsDeleteOpen}
                        title={`Delete dormitory "${dormitory.name}"`}
                        description={`Are you sure you want to delete this dormitory?`}
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
