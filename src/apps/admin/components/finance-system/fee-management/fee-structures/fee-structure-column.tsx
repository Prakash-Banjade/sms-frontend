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
import { TFeeStructure } from "@/apps/admin/types/finance-system/fee-management.types"
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog"
import { useAppMutation } from "@/hooks/useAppMutation"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { QueryKey } from "@/react-query/queryKeys"

export const feeStructureColumns: ColumnDef<TFeeStructure>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Charge Head",
        accessorKey: "chargeHead.name",
    },
    {
        accessorKey: "amount",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Amount" />
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const [isEditOpen, setIsEditOpen] = useState(false);
            const [isDeleteOpen, setIsDeleteOpen] = useState(false);

            const { mutateAsync, isPending } = useAppMutation();

            const handleDelete = async () => {
                await mutateAsync({
                    method: "delete",
                    endpoint: `${QueryKey.CHARGE_HEADS}/${row.original.id}`,
                    invalidateTags: [QueryKey.CHARGE_HEADS],
                });
            }

            return (
                <>
                    <ResponsiveDialog
                        isOpen={isEditOpen}
                        setIsOpen={setIsEditOpen}
                        title="Edit charge head"
                    >
                        <></>
                    </ResponsiveDialog>

                    <ResponsiveAlertDialog
                        isOpen={isDeleteOpen}
                        setIsOpen={setIsDeleteOpen}
                        title="Delete Charge Head"
                        description="Are you sure you want to delete this charge head? This will also delete all the fees associated with this charge head."
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
                            <DropdownMenuButtonItem onClick={() => setIsDeleteOpen(true)}>
                                <span>Delete</span>
                            </DropdownMenuButtonItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )
        },
    },
]
