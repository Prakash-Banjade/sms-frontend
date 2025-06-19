import { ColumnDef } from "@tanstack/react-table"
import {
    DestructiveDropdownMenuButtonItem,
    DropdownMenu,
    DropdownMenuButtonItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Teacher } from "@/apps/admin/types/teacher.type"
import { TooltipWrapper } from "@/components/ui/tooltip"
import { formatDate } from "@/utils/format-date"
import { ProfileAvatar } from "@/components/ui/avatar"
import { getImageUrl } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { differenceInYears } from "date-fns"
import { useAuth } from "@/contexts/auth-provider"
import { useState } from "react"
import { useAppMutation } from "@/hooks/useAppMutation"
import { QueryKey } from "@/react-query/queryKeys"
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog"
import { Role } from "@/types/global.type"
import toast from "react-hot-toast"

export const teachersColumns: ColumnDef<Teacher>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Teacher ID",
        accessorKey: "teacherId",
        cell: ({ row }) => {
            const handleCopy = () => {
                navigator.clipboard.writeText(row.original.teacherId?.toString())
                toast.success('Teacher ID copied to clipboard', {
                    duration: 2000,
                    position: 'top-right',
                });
            }

            return <TooltipWrapper label={'Click to copy'}>
                <button type="button" onClick={handleCopy}>
                    {row.original.teacherId}
                </button>
            </TooltipWrapper>
        }
    },
    {
        header: "Name",
        accessorKey: "teacherFullName",
        cell: ({ row }) => {
            return <TooltipWrapper label={'Click to view'}>
                <Link to={row.original.id} className="hover:text-blue-500 hover:underline flex gap-4 items-center w-fit">
                    <ProfileAvatar
                        name={row.original.firstName + ' ' + row.original.lastName}
                        src={getImageUrl(row.original.account?.profileImage?.url, "w=40")}
                        className="size-10"
                    />
                    <span className="font-medium">
                        {row.original.firstName + ' ' + row.original.lastName}
                    </span>
                </Link>
            </TooltipWrapper>
        }
    },
    {
        header: "Gender",
        accessorKey: "gender",
        cell: ({ row }) => {
            return <span className="capitalize">{row.original.gender}</span>
        },
    },
    {
        header: "Email",
        accessorKey: "email",
        cell: ({ row }) => {
            return <TooltipWrapper label={'Click to send mail'}>
                <a href={`mailto:${row.original.email}`} className="hover:text-blue-500 hover:underline">{row.original.email}</a>
            </TooltipWrapper>
        },
    },
    {
        header: "Phone",
        accessorKey: "phone",
        cell: ({ row }) => {
            return <TooltipWrapper label={'Click to call'}>
                <a href={`tel:${row.original.phone}`} className="hover:text-blue-500 hover:underline">{row.original.phone}</a>
            </TooltipWrapper>
        }
    },
    {
        header: "Date of Birth",
        cell: ({ row }) => {
            return <span>
                {formatDate({ date: new Date(row.original.dob) })}&nbsp;
                <span className="text-xs text-muted-foreground">
                    ({differenceInYears(new Date(), new Date(row.original.dob))} Y)
                </span>
            </span>
        }
    },
    {
        header: "Joined Date",
        cell: ({ row }) => {
            return <span>
                {formatDate({ date: new Date(row.original.joinedDate) })}
            </span>
        }
    },
    {
        header: "Department",
        accessorKey: "faculties",
        cell: ({ row }) => {
            const faculties = row.original.faculties;

            if (faculties.length === 0) return <p className="text-center text-muted-foreground">N/A</p>;

            return (
                <ul>
                    {faculties.map((faculty) => (
                        <li key={faculty.id}>
                            <Badge className="capitalize whitespace-nowrap" variant={'outline'}>{faculty.name}</Badge>
                        </li>
                    ))}
                </ul>
            )
        }
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const navigate = useNavigate();
            const { payload } = useAuth();
            const [isDeleteOpen, setIsDeleteOpen] = useState(false);

            const { mutateAsync, isPending } = useAppMutation();

            const handleDelete = async () => {
                await mutateAsync({
                    id: row.original.id,
                    endpoint: QueryKey.TEACHERS,
                    method: 'delete',
                    invalidateTags: [QueryKey.TEACHERS],
                });
            }

            return (
                <>
                    <ResponsiveAlertDialog
                        isOpen={isDeleteOpen}
                        setIsOpen={setIsDeleteOpen}
                        title="Remove Teacher"
                        description={`Are you sure you want to remove ${row.original.firstName + ' ' + row.original.lastName}? This action cannot be undone. This will also remove all the data related to this teacher.`}
                        action={handleDelete}
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
                            <DropdownMenuButtonItem onClick={() => navigate(`${row.original.id}/edit`)}>
                                <Pencil />
                                <span>Edit</span>
                            </DropdownMenuButtonItem>
                            {
                                payload?.role === Role.SUPER_ADMIN && (
                                    <DestructiveDropdownMenuButtonItem onClick={() => setIsDeleteOpen(true)}>
                                        <Trash />
                                        Remove
                                    </DestructiveDropdownMenuButtonItem>
                                )
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )
        },
    },
]
