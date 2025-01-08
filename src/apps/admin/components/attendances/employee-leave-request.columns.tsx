import { ColumnDef } from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Check, CircleDashed, LoaderCircle, MoreHorizontal, X } from "lucide-react"
import { formatDateNumeric } from "@/utils/format-date"
import { TEmployeeLeaveRequest } from "@/types/leave-request.type"
import { Badge } from "@/components/ui/badge"
import { ELeaveRequestStatus } from "@/types/global.type"
import { useAppMutation } from "@/hooks/useAppMutation"
import { QueryKey } from "@/react-query/queryKeys"
import { useState } from "react"
import { LeaveRequestRequestDescription } from "@/apps/common/components/leave-request/leave-request-list"

export const employeeLeaveRequestsColumns: ColumnDef<TEmployeeLeaveRequest>[] = [
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
        header: "Employee Name",
        cell: ({ row }) => {
            const empName = row.original.account?.teacher
                ? row.original.account?.teacher?.firstName + ' ' + row.original.account?.teacher?.lastName
                : row.original.account?.staff
                    ? row.original.account?.staff?.firstName + ' ' + row.original.account?.staff?.lastName
                    : ''

            return <span>{empName}</span>
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
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
            <section className="max-w-[200px]">
                <LeaveRequestRequestDescription description={row.original?.description ?? ''} />
            </section>
        )
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
            const currentStatus = row.original.status;
            const [isOpen, setIsOpen] = useState(false);

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
                    toastOnSuccess: false,
                    toastOnError: false,
                });

                setStatusLoading({ ...statusLoading, [status]: false });
                setIsOpen(false);
            };

            return (
                <>
                    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <section className="flex flex-col">
                                {
                                    currentStatus !== ELeaveRequestStatus.PENDING && <Button variant={'ghost'} size={'sm'} className="px-2 py-1.5 justify-start" onClick={() => handleUpdateStatus(ELeaveRequestStatus.PENDING)} disabled={isPending}>
                                        {
                                            statusLoading[ELeaveRequestStatus.PENDING] ? <LoaderCircle className="animate-spin" /> : <CircleDashed />
                                        }
                                        Mark as Pending
                                    </Button>
                                }
                                {
                                    currentStatus !== ELeaveRequestStatus.APPROVED && <Button variant={'ghost'} size={'sm'} className="px-2 py-1.5 justify-start" onClick={() => handleUpdateStatus(ELeaveRequestStatus.APPROVED)} disabled={isPending}>
                                        {
                                            statusLoading[ELeaveRequestStatus.APPROVED] ? <LoaderCircle className="animate-spin" /> : <Check />
                                        }
                                        Mark as Approved
                                    </Button>
                                }
                                {
                                    currentStatus !== ELeaveRequestStatus.REJECTED && <Button variant={'ghost'} size={'sm'} className="px-2 py-1.5 justify-start" onClick={() => handleUpdateStatus(ELeaveRequestStatus.REJECTED)} disabled={isPending}>
                                        {
                                            statusLoading[ELeaveRequestStatus.REJECTED] ? <LoaderCircle className="animate-spin" /> : <X />
                                        }
                                        Mark as Rejected
                                    </Button>
                                }
                            </section>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )
        },
    },
]
