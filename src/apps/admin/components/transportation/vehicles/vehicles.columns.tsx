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
import { TVehicle } from "@/types/vehicle.type"
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog"
import VehicleForm, { vehicleFormType } from "./vehicles-form"

export const vehiclesColumns: ColumnDef<TVehicle>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Vehicle Number",
        accessorKey: "vehicleNumber",
    },
    {
        header: "Vehicle Model",
        accessorKey: "vehicleModel",
    },
    {
        header: "Type",
        accessorKey: "type",
        cell: ({ row }) => {
            return <span className="capitalize">{row.original.type}</span>
        },
    },
    {
        header: "Year Made",
        accessorKey: "yearMade",
    },
    {
        header: "Capacity",
        accessorKey: "capacity",
    },
    {
        header: "Driver",
        accessorKey: "driver",
        cell: ({ row }) => {
            return row.original.driver
                ? <p>
                    {row.original.driver?.firstName} {row.original.driver?.lastName}
                </p> : <span className="text-muted-foreground">N/A</span>
        },
    },
    {
        header: "Driver Contact",
        accessorKey: "driverContact",
        cell: ({ row }) => {
            return row.original.driver?.phone
                ? <p>
                    {row.original.driver?.phone}
                </p> : <span className="text-muted-foreground">N/A</span>
        },
    },
    {
        header: "Note",
        accessorKey: "note",
        cell: ({ row }) => {
            return !!row.original.note
                ? <p className="text-14 font-medium break-words max-w-[40ch]">
                    {row.original.note}
                </p> : <span className="text-muted-foreground">-</span>
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const vehicle = row.original;
            const [isEditOpen, setIsEditOpen] = useState(false);
            const [isDeleteOpen, setIsDeleteOpen] = useState(false);

            const { mutateAsync, isPending } = useAppMutation<vehicleFormType, any>();

            async function handleDelete() {
                await mutateAsync({
                    method: "delete",
                    endpoint: `${QueryKey.VEHICLES}/${vehicle.id}`,
                    invalidateTags: [QueryKey.VEHICLES],
                });
            }

            return (
                <>
                    <ResponsiveDialog
                        isOpen={isEditOpen}
                        setIsOpen={setIsEditOpen}
                        title="Edit Vehicle"
                        className="w-[97%] max-w-[800px]"
                    >
                        <VehicleForm vehicleId={row.original.id} setIsOpen={setIsEditOpen} defaultValues={{
                            ...row.original,
                            driverId: row.original.driver?.id
                        }} />
                    </ResponsiveDialog>

                    <ResponsiveAlertDialog
                        isOpen={isDeleteOpen}
                        setIsOpen={setIsDeleteOpen}
                        title={`Delete vehicle "${vehicle.vehicleNumber}"`}
                        description={`Are you sure you want to delete this vehicle?`}
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
