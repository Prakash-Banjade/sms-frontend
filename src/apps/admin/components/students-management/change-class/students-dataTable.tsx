import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TStudent_BasicInfo } from "@/apps/admin/types/student.type"
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ResponsiveDialog } from "@/components/ui/responsive-dialog"
import ChangeClassForm from "./change-class.form"

interface DataTableProps {
    data: TStudent_BasicInfo[],
}

export function ChangeClass_DataTable({
    data,
}: DataTableProps) {
    const [rowSelection, setRowSelection] = useState({});
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        setRowSelection({});
    }, [data])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            rowSelection,
        }
    });

    return (
        <>
            <div className="rounded-md border overflow-hidden">
                <Table>
                    <TableHeader className="bg-tableheader">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="font-bold">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No students.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {
                !!table.getFilteredSelectedRowModel().rows.length && <section className="flex gap-2 items-center justify-between">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} student(s) selected
                    </div>

                    <ResponsiveDialog
                        isOpen={isFormOpen}
                        setIsOpen={setIsFormOpen}
                        title="Edit Academic Year"
                    >
                        <ChangeClassForm setIsOpen={setIsFormOpen} selectedStudentIds={table.getFilteredSelectedRowModel().rows.map(row => row.original.id)} />
                    </ResponsiveDialog>

                    <Button type="button" onClick={() => setIsFormOpen(true)}>
                        Change Class
                    </Button>
                </section>
            }
        </>
    )
}

const columns: ColumnDef<TStudent_BasicInfo>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
    },
    {
        accessorKey: "fullName",
        header: "Name",
    },
    {
        accessorKey: "studentId",
        header: "Student ID",
    },
    {
        header: "Class",
        accessorKey: "classRoomName",
        cell: ({ row }) => {
            return (
                <p className="whitespace-nowrap">
                    <span>{row.original.classRoomName}</span>
                    <br />
                    <span className="text-muted-foreground text-xs">({row.original.faculty})</span>
                </p>
            )
        }
    },
]