import { ColumnDef } from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuButtonItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Check, CircleDashed, LoaderCircle, MoreHorizontal, X } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { TooltipWrapper } from "@/components/ui/tooltip"
import { formatDateNumeric } from "@/utils/format-date"
import { TStudentLeaveRequest } from "@/types/leave-request.type"
import { Badge } from "@/components/ui/badge"
import { ELeaveRequestStatus } from "@/types/global.type"
import { useAppMutation } from "@/hooks/useAppMutation"
import { QueryKey } from "@/react-query/queryKeys"
import { useState } from "react"

export const leaveRequestsColumns: ColumnDef<TStudentLeaveRequest>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        accessorKey: "requestedDate",
        header: "Requested Date",
        cell: ({ row }) => <span>{formatDateNumeric({ date: new Date(row.original?.createdAt) })}</span>
    },
    {
        accessorKey: "name",
        header: "Student Name",
        cell: ({ row }) => {
            const studentName = row.original?.account?.student?.firstName + ' ' + row.original?.account?.student?.lastName

            return <TooltipWrapper label={'Click to view'}>
                <Link to={`/admin/students/${row.original?.account?.student?.id}`} className="hover:text-blue-500 hover:underline">
                    {studentName}
                </Link>
            </TooltipWrapper>
        }
    },
    {
        accessorKey: "rollNo",
        header: "Roll No.",
        cell: ({ row }) => <span>{row.original?.account?.student?.rollNo}</span>
    },
    {
        header: "Class",
        cell: ({ row }) => {
            const classRoomName = row.original?.account?.student?.classRoom?.parent?.name
                ? `${row.original?.account?.student?.classRoom?.parent?.name} - ${row.original?.account?.student?.classRoom?.name}`
                : `${row.original?.account?.student?.classRoom?.name}`

            return <span>{classRoomName}</span>
        }
    },
    {
        accessorKey: "leaveFrom",
        header: "Leave From",
        cell: ({ row }) => <span>{formatDateNumeric({ date: new Date(row.original?.leaveFrom) })}</span>
    },
    {
        accessorKey: "leaveTo",
        header: "Leave To",
        cell: ({ row }) => <span>{formatDateNumeric({ date: new Date(row.original?.leaveTo) })}</span>
    },
    {
        accessorKey: "Reacon",
        header: "Reason",
        cell: ({ row }) => <span>{row.original?.title}</span>
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            return (
                <Badge
                    variant={
                        row.original?.status === ELeaveRequestStatus.APPROVED
                            ? 'success'
                            : row.original?.status === ELeaveRequestStatus.REJECTED
                                ? 'destructive'
                                : 'default'
                    }
                    className="capitalize"
                >{row.original?.status}</Badge>
            )
        }
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const { mutateAsync, isPending } = useAppMutation();
            const [statusLoading, setStatusLoading] = useState({
                [ELeaveRequestStatus.APPROVED]: false,
                [ELeaveRequestStatus.REJECTED]: false,
                [ELeaveRequestStatus.PENDING]: false,
            });

            const handleUpdateStatus = async (status: ELeaveRequestStatus) => {
                setStatusLoading({ ...statusLoading, [status]: true });

                await mutateAsync({
                    method: "patch",
                    endpoint: QueryKey.LEAVE_REQUESTS + `/${row.original.id}/updateStatus`,
                    data: { status },
                    invalidateTags: [QueryKey.LEAVE_REQUESTS],
                });

                setStatusLoading({ ...statusLoading, [status]: false });
            };

            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuButtonItem onClick={() => handleUpdateStatus(ELeaveRequestStatus.PENDING)} disabled={isPending}>
                                {
                                    statusLoading[ELeaveRequestStatus.PENDING] ? <LoaderCircle className="animate-spin" /> : <CircleDashed />
                                }
                                Mark as Pending
                            </DropdownMenuButtonItem>
                            <DropdownMenuButtonItem onClick={() => handleUpdateStatus(ELeaveRequestStatus.APPROVED)} disabled={isPending}>
                                {
                                    statusLoading[ELeaveRequestStatus.APPROVED] ? <LoaderCircle className="animate-spin" /> : <Check />
                                }
                                Mark as Approved
                            </DropdownMenuButtonItem>
                            <DropdownMenuButtonItem onClick={() => handleUpdateStatus(ELeaveRequestStatus.REJECTED)} disabled={isPending}>
                                {
                                    statusLoading[ELeaveRequestStatus.REJECTED] ? <LoaderCircle className="animate-spin" /> : <X />
                                }
                                Mark as Rejected
                            </DropdownMenuButtonItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )
        },
    },
]
