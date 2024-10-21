import { TAcademicYear } from "@/types/academic-year.type"
import { formatDate } from "@/utils/format-date"
import { ColumnDef } from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { useAppMutation } from "@/hooks/useAppMutation"
import { academicYearFormSchemaType } from "./academic-year-form"
import { QueryKey } from "@/react-query/queryKeys"
import { useAxios } from "@/services/api"

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
                ? <p className="text-14 font-medium text-green-500">Active</p>
                : <p className="text-14 font-medium text-red-500">Inactive</p>
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const academicYear = row.original;

            const { mutateAsync } = useAppMutation<academicYearFormSchemaType, any>();

            async function changeActive() {
                await mutateAsync({
                    method: "patch",
                    endpoint: `${QueryKey.ACADEMIC_YEARS}/${academicYear.id}/change-active`,
                    invalidateTags: [QueryKey.ACADEMIC_YEARS],
                });
            }

            return (
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
                            !academicYear.isActive && <DropdownMenuItem onClick={changeActive}>
                                <span>Set Active</span>
                            </DropdownMenuItem>
                        }
                        <DropdownMenuItem>
                            <span>Edit</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
