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
import { TChargeHead } from "@/types/finance-system/fee-management.types"
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog"
import { useAppMutation } from "@/hooks/useAppMutation"
import ChargeHeadFrom from "./charge-head-form"

export const chargeHeadColumns: ColumnDef<TChargeHead>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Name",
        accessorKey: "name",
    },
    {
        header: "Period",
        accessorKey: "period",
        cell: ({ row }) => <p className="capitalize">{row.original.period}</p>,
    },
    {
        header: "Is Mandatory",
        accessorKey: "isMandatory",
        cell: ({ row }) => <p> {row.original.isMandatory ? "Yes" : "No"} </p>,
    },
    {
        header: "Description",
        accessorKey: "description",
        cell: ({ row }) => <p className="max-w-[60ch]">{row.original.description}</p>,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const [isEditOpen, setIsEditOpen] = useState(false);
            const [isDeleteOpen, setIsDeleteOpen] = useState(false);

            const { isPending } = useAppMutation();

            const handleDelete = async () => {
                // await mutateAsync({
                //     method: "delete",
                //     endpoint: `${FinanceQueryKey.CHARGE_HEADS}/${row.original.id}`,
                //     invalidateTags: [FinanceQueryKey.CHARGE_HEADS],
                // });
            }

            return (
                <>
                    <ResponsiveDialog
                        isOpen={isEditOpen}
                        setIsOpen={setIsEditOpen}
                        title="Edit charge head"
                    >
                        <ChargeHeadFrom
                            chargeHeadId={row.original.id}
                            defaultValues={{
                                name: row.original.name,
                                description: row.original.description,
                                isMandatory: String(row.original.isMandatory),
                                period: row.original.period,
                            }}
                            setIsOpen={setIsEditOpen}
                        />
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
                            {
                                !row.original.isMandatory && <DestructiveDropdownMenuButtonItem onClick={() => setIsDeleteOpen(true)}>
                                    <span>Delete</span>
                                </DestructiveDropdownMenuButtonItem>
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )
        },
    },
]
