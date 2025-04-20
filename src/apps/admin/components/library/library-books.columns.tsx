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
import { useState } from "react"
import { ResponsiveDialog } from "@/components/ui/responsive-dialog"
import { TLibraryBook } from "@/apps/admin/types/library-book.type"
import { libraryBookSchemaType } from "../../schemas/library-book.schema"
import LibraryBookForm from "./library-book.form"
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog"
import { QueryKey } from "@/react-query/queryKeys"

export const libraryBooksColumns: ColumnDef<TLibraryBook>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Book code",
        accessorKey: "bookCode",
    },
    {
        header: "Book name",
        accessorKey: "bookName",
    },
    {
        header: "Category",
        accessorKey: "category",
        cell: ({ row }) => {
            return <span>{row.original.category?.name || 'N/A'}</span>;
        }
    },
    {
        header: "Publisher name",
        accessorKey: "publisherName",
        cell: ({ row }) => {
            return <span>{row.original.publisherName || 'N/A'}</span>;
        }
    },
    {
        header: "Publication year",
        accessorKey: "publicationYear",
    },
    {
        header: "Available / Total",
        accessorKey: "copiesCount",
        cell: ({ row }) => {
            return <span>
                {row.original.copiesCount - row.original.issuedCount} / {row.original.copiesCount}
            </span>
        }
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const [isEditOpen, setIsEditOpen] = useState(false);
            const [isDeleteOpen, setIsDeleteOpen] = useState(false);

            const { mutateAsync, isPending } = useAppMutation<libraryBookSchemaType, any>();

            const handleDelete = async () => {
                await mutateAsync({
                    method: "delete",
                    endpoint: QueryKey.LIBRARY_BOOKS + `/${row.original.id}`,
                    invalidateTags: [QueryKey.LIBRARY_BOOKS],
                });
            }

            return (
                <>
                    <ResponsiveDialog
                        isOpen={isEditOpen}
                        setIsOpen={setIsEditOpen}
                        title="Edit Library Book"
                        className="w-[97%] max-w-[600px]"
                    >
                        <LibraryBookForm libraryBookId={row.original.id} setIsOpen={setIsEditOpen} defaultValues={{
                            ...row.original,
                            categoryId: row.original.category?.id,
                        }} />
                    </ResponsiveDialog>

                    <ResponsiveAlertDialog
                        isOpen={isDeleteOpen}
                        setIsOpen={setIsDeleteOpen}
                        title={`Delete Library Book "${row.original.bookName}"`}
                        description="Are you sure you want to delete this library book?"
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
                                <span>Edit Book</span>
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
