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
import { TClass } from "@/types/class.type"
import ClassSectionForm from "./class-room-section.form"

export const sectionsColumns: ColumnDef<TClass>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Section name",
        accessorKey: "name",
    },
    {
        header: "Total students",
        accessorKey: "totalStudentsCount",
    },
    {
        header: "Total boys",
        accessorKey: "totalMalesStudentsCount",
        cell: ({ row }) => {
            const percentage = row.original.totalStudentsCount === 0
                ? 0
                : (row.original.totalMalesStudentsCount / row.original.totalStudentsCount) * 100;
            return !percentage ?
                <span>{row.original.totalMalesStudentsCount}</span>
                : <span>
                    {row.original.totalMalesStudentsCount}{" "}
                    <span className="text-muted-foreground text-sm">({Math.round(percentage)}%)</span>
                </span>
        }
    },
    {
        header: "Total girls",
        accessorKey: "totalFemalesStudentsCount",
        cell: ({ row }) => {
            const percentage = row.original.totalStudentsCount === 0
                ? 0
                : (row.original.totalFemalesStudentsCount / row.original.totalStudentsCount) * 100;
            return !percentage ?
                <span>{row.original.totalFemalesStudentsCount}</span>
                : <span>
                    {row.original.totalFemalesStudentsCount}{" "}
                    <span className="text-muted-foreground text-xs">({Math.round(percentage)}%)</span>
                </span>
        }
    },
    {
        header: "Location",
        accessorKey: "location",
        cell: ({ row }) => {
            return !!row.original.location
                ? <span>{row.original.location}</span>
                : <span className="text-muted-foreground">**Not Available**</span>
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const [isEditOpen, setIsEditOpen] = useState(false);
            const [_, setIsSectionFormOpen] = useState(false);
            // const [isDeleteOpen, setIsDeleteOpen] = useState(false);

            // const { mutateAsync } = useAppMutation<classRoomFormSchemaType, any>();

            return (
                <>
                    <ResponsiveDialog
                        isOpen={isEditOpen}
                        setIsOpen={setIsEditOpen}
                        title="Edit class"
                    >
                        <ClassSectionForm
                            parentClassId={row.original.id}
                            setIsOpen={setIsSectionFormOpen}
                            defaultValues={{
                                name: row.original.name,
                                monthlyFee: row.original.monthlyFee,
                                monthlyTutionFee: row.original.monthlyTutionFee,
                                location: row.original.location
                            }}
                        />
                    </ResponsiveDialog>
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
                                <span>Edit section</span>
                            </DropdownMenuButtonItem>
                            {/* <DropdownMenuButtonItem onClick={() => setIsDeleteOpen(true)}>
                                <span>Delete</span>
                            </DropdownMenuButtonItem> */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )
        },
    },
]
