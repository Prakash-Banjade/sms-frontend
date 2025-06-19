import { ColumnDef } from "@tanstack/react-table"
import { DestructiveDropdownMenuButtonItem, DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { TUser } from "../../types/users.type"
import { ProfileAvatar } from "@/components/ui/avatar"
import { getImageUrl } from "@/lib/utils"
import { useAppMutation } from "@/hooks/useAppMutation"
import { QueryKey } from "@/react-query/queryKeys"
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog"
import { useState } from "react"

export const usersColumns: ColumnDef<TUser>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            return <div className="flex gap-4 items-center">
                <ProfileAvatar
                    name={row.original.fullName}
                    src={getImageUrl(row.original.profileImageUrl, "w=40")}
                    className="size-10"
                />
                {row.original.fullName}
            </div>
        }
    },
    {
        header: "Email",
        accessorKey: "email",
    },
    {
        header: "Role",
        accessorKey: "role",
        cell: ({ row }) => <p className="text-14 font-medium capitalize">{row.original.role}</p>
    },
    {
        header: "Branch",
        accessorKey: "branchName",
        cell: ({ row }) => <p className="text-14 font-medium capitalize">{row.original.branchName}</p>
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const { mutateAsync, isPending } = useAppMutation();
            const [isDeleteOpen, setIsDeleteOpen] = useState(false);

            const handleRemove = async () => {
                await mutateAsync({
                    id: row.original.id,
                    endpoint: QueryKey.USERS,
                    method: 'delete',
                    invalidateTags: [QueryKey.USERS],
                });
            }

            return (
                <>
                    <ResponsiveAlertDialog
                        isOpen={isDeleteOpen}
                        setIsOpen={setIsDeleteOpen}
                        title="Remove Admin"
                        description={`Are you sure you want to remove ${row.original.fullName}? This action cannot be undone.`}
                        action={handleRemove}
                        actionLabel="Yes, remove"
                        isLoading={isPending}
                        loadingText="Removing..."
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
                            <DestructiveDropdownMenuButtonItem onClick={() => setIsDeleteOpen(true)}>
                                Remove
                            </DestructiveDropdownMenuButtonItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )
        },
    },
]
