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
import { TNotice } from "@/types/notice.type"
import { formatDate } from "@/utils/format-date"
import { useAppMutation } from "@/hooks/useAppMutation"
import { Link, useNavigate } from "react-router-dom"
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog"
import { QueryKey } from "@/react-query/queryKeys"
import { TooltipWrapper } from "@/components/ui/tooltip"

export const noticesColumns: ColumnDef<TNotice>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Title",
        accessorKey: "title",
        cell: ({ row }) => {
            return (
                <TooltipWrapper label="Click to view">
                    <Link to={`${row.original.id}`} className="hover:text-blue-500 hover:underline">
                        {row.original.title}
                    </Link>
                </TooltipWrapper>
            )
        }
    },
    {
        header: "Published On",
        accessorKey: "createdAt",
        cell: ({ row }) => {
            return <span>{formatDate({ date: new Date(row.original.createdAt) })}</span>
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const navigate = useNavigate();
            const [isDeleteOpen, setIsDeleteOpen] = useState(false);

            const { mutateAsync, isPending } = useAppMutation();

            const handleDelete = async () => {
                await mutateAsync({
                    method: "delete",
                    endpoint: QueryKey.NOTICES + `/${row.original.id}`,
                    invalidateTags: [QueryKey.NOTICES],
                });

                setIsDeleteOpen(false);
            };

            return (
                <>
                    <ResponsiveAlertDialog
                        isOpen={isDeleteOpen}
                        setIsOpen={setIsDeleteOpen}
                        title="Delete Notice"
                        description="Are you sure you want to delete this notice?"
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
                            <DropdownMenuButtonItem onClick={() => navigate(row.original.id + '?edit=true')}>
                                <span>Edit notice</span>
                            </DropdownMenuButtonItem>
                            <DropdownMenuButtonItem onClick={() => setIsDeleteOpen(true)} className="text-destructive">
                                <span>Delete</span>
                            </DropdownMenuButtonItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )
        },
    },
]
