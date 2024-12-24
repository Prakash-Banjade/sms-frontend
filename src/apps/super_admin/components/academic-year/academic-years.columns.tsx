import { TAcademicYear } from "@/types/academic-year.type"
import { formatDate } from "@/utils/format-date"
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
import AcademicYearForm, { academicYearFormSchemaType } from "./academic-year-form"
import { QueryKey } from "@/react-query/queryKeys"
import { useState } from "react"
import { ResponsiveDialog } from "@/components/ui/responsive-dialog"
import { Badge } from "@/components/ui/badge"
import { useQueryClient } from "@tanstack/react-query"
import { setCookie } from "@/utils/cookie"
import { CookieKey } from "@/CONSTANTS"

export const academicYearColumns: ColumnDef<TAcademicYear>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Name",
        accessorKey: "name",
    },
    {
        header: "Start Date",
        accessorKey: "startDate",
        cell: ({ row }) => <p className="text-14 font-medium">{formatDate({ date: new Date(row.original.startDate) })}</p>,
    },
    {
        header: "End Date",
        accessorKey: "endDate",
        cell: ({ row }) => <p className="text-14 font-medium">{formatDate({ date: new Date(row.original.endDate) })}</p>,
    },
    {
        header: "Status",
        accessorKey: "isActive",
        cell: ({ row }) => {
            return row.original.isActive
                ? <Badge variant="success">Active</Badge>
                : <Badge variant="outline">Inactive</Badge>
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const academicYear = row.original;
            const [isEditOpen, setIsEditOpen] = useState(false);
            const queryclient = useQueryClient();

            const { mutateAsync } = useAppMutation<academicYearFormSchemaType, any>();

            async function changeActive() {
                setCookie(CookieKey.ACADEMICYEAR_ID, academicYear.id, {
                    sameSite: import.meta.env.NODE_ENV === 'production' ? 'None' : 'Lax',
                    secure: import.meta.env.NODE_ENV === 'production',
                    domain: import.meta.env.VITE_API_DOMAIN,
                });

                await mutateAsync({
                    method: "patch",
                    endpoint: `${QueryKey.ACADEMIC_YEARS}/${academicYear.id}/change-active`,
                    invalidateTags: [QueryKey.ACADEMIC_YEARS],
                });

                queryclient.invalidateQueries({ queryKey: [QueryKey.STUDENTS] })
            }

            return (
                <>
                    <ResponsiveDialog
                        isOpen={isEditOpen}
                        setIsOpen={setIsEditOpen}
                        title="Edit Academic Year"
                    >
                        <AcademicYearForm academicYearId={row.original.id} setIsOpen={setIsEditOpen} defaultValues={row.original} />
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
                            {
                                !academicYear.isActive && <DropdownMenuButtonItem onClick={changeActive}>
                                    <span>Set Active</span>
                                </DropdownMenuButtonItem>
                            }
                            <DropdownMenuButtonItem onClick={() => setIsEditOpen(true)}>
                                <span>Edit</span>
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
