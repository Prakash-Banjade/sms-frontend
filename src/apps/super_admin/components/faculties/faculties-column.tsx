import { ColumnDef } from "@tanstack/react-table"
import { DestructiveDropdownMenuButtonItem, DropdownMenu, DropdownMenuButtonItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { useAppMutation } from "@/hooks/useAppMutation"
import { QueryKey } from "@/react-query/queryKeys"
import { useState } from "react"
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog"
import { TFaculty } from "../../data-access/faculties-data-access"
import { useNavigate } from "react-router-dom"

export const facultiesColumns: ColumnDef<TFaculty>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Name",
        accessorKey: "name",
    },
    {
        header: "Description",
        accessorKey: "description",
        cell: ({ row }) => {
            return <p className="max-w-lg">{row.original.description || '-'}</p>
        }
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const faculty = row.original;
            const [isDeleteOpen, setIsDeleteOpen] = useState(false);
            const navigate = useNavigate();

            const { mutateAsync, isPending } = useAppMutation();

            async function handleDelete() {
                await mutateAsync({
                    method: "delete",
                    endpoint: `${QueryKey.FACULTIES}/${faculty.id}`,
                    invalidateTags: [QueryKey.FACULTIES],
                });
            }

            return (
                <>
                    <ResponsiveAlertDialog
                        isOpen={isDeleteOpen}
                        setIsOpen={setIsDeleteOpen}
                        title={`Delete faculty "${faculty.name}"`}
                        description={`Are you sure you want to delete this faculty?`}
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
                            <DropdownMenuButtonItem onClick={() => navigate(`${faculty.id}/edit`)}>
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
