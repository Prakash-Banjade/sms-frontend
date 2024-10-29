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
import { TBookCategory } from "@/types/library-book.type"
import BookCategoryForm, { bookCategoryFormSchemaType } from "./book-category-form"


export const bookCategoriesColumns: ColumnDef<TBookCategory>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Category Name",
        accessorKey: "name",
    },
    {
        header: "Books Count",
        accessorKey: "booksCount",
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const bookCategory = row.original;
            const [isEditOpen, setIsEditOpen] = useState(false);
            const [isDeleteOpen, setIsDeleteOpen] = useState(false);

            const { mutateAsync, isPending } = useAppMutation<bookCategoryFormSchemaType, any>();

            async function handleDelete() {
                await mutateAsync({
                    method: "delete",
                    endpoint: `${QueryKey.BOOK_CATEGORIES}/${bookCategory.id}`,
                    invalidateTags: [QueryKey.BOOK_CATEGORIES],
                });
            }

            return (
                <>
                    <ResponsiveDialog
                        isOpen={isEditOpen}
                        setIsOpen={setIsEditOpen}
                        title="Edit Category"
                    >
                        <BookCategoryForm bookCategoryId={row.original.id} setIsOpen={setIsEditOpen} defaultValues={row.original} />
                    </ResponsiveDialog>

                    <ResponsiveAlertDialog
                        isOpen={isDeleteOpen}
                        setIsOpen={setIsDeleteOpen}
                        title={`Delete category "${bookCategory.name}"`}
                        description={`Are you sure you want to delete this category?`}
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
