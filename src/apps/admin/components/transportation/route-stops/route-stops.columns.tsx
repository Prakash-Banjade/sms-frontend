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
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog"
import { TRouteStop } from "@/apps/admin/types/route-stop.type"
import RouteStopForm, { routeFormType } from "./route-stop.form"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"


export enum ERouteStopSortBy {
    Sequence = 'sequence',
}

export const routeStopsColumns: ColumnDef<TRouteStop>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Stop Name",
        accessorKey: "name",
    },
    {
        header: "Stop Location",
        accessorKey: "location",
    },
    {
        accessorKey: "sequence",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Sequence" /> 
        },
    },
    {
        header: "Vehicle Number",
        accessorKey: "vehicleNumber",
        cell: ({ row }) => {
            return <span className="capitalize">{row.original.vehicle?.vehicleNumber || <span className="text-muted-foreground">N/A</span>}</span>
        }
    },
    {
        header: "Vehicle Type",
        accessorKey: "vehicleType",
        cell: ({ row }) => {
            return <span className="capitalize">{row.original.vehicle?.type || <span className="text-muted-foreground">N/A</span>}</span>
        },
    },
    {
        header: "Pick Up Time",
        accessorKey: "pickUpTime",
    },
    {
        header: "Drop Off Time",
        accessorKey: "dropOffTime",
    },
    {
        header: "Distance (Km)",
        accessorKey: "distance",
    },
    {
        header: "Fare",
        accessorKey: "fare",
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const routeStop = row.original;
            const [isEditOpen, setIsEditOpen] = useState(false);
            const [isDeleteOpen, setIsDeleteOpen] = useState(false);

            const { mutateAsync, isPending } = useAppMutation<routeFormType, any>();

            async function handleDelete() {
                await mutateAsync({
                    method: "delete",
                    endpoint: `${QueryKey.ROUTE_STOPS}/${routeStop.id}`,
                    invalidateTags: [QueryKey.ROUTE_STOPS],
                });
            }

            return (
                <>
                    <ResponsiveDialog
                        isOpen={isEditOpen}
                        setIsOpen={setIsEditOpen}
                        title="Edit Route Stop"
                        className="w-[97%] max-w-[800px]"
                    >
                        <RouteStopForm
                            routeStopId={row.original.id}
                            setIsOpen={setIsEditOpen}
                            defaultValues={{
                                ...row.original,
                                vehicleId: row.original.vehicle?.id
                            }}
                        />
                    </ResponsiveDialog>

                    <ResponsiveAlertDialog
                        isOpen={isDeleteOpen}
                        setIsOpen={setIsDeleteOpen}
                        title={`Delete routeStop "${routeStop.name}"`}
                        description={`Are you sure you want to delete this route stop?`}
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
