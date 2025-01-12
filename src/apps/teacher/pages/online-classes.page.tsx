import ContainerLayout from '@/components/aside-layout.tsx/container-layout'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import CreateLiveClassForm from '../components/online-classes/live-online-class/create-live-class-form'
import { Calendar, Copy, Merge, MoreHorizontal, Plus, Radio } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { EOnlineClassStatus, TOnlineClass, useGetOnlineClasses } from '../data-access/online-class-data-access'
import { DataTable } from '@/components/data-table/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuButtonItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import toast from 'react-hot-toast'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { format } from 'date-fns'
import { useAuth } from '@/contexts/auth-provider'
import { Role } from '@/types/global.type'
import SearchInput from '@/components/search-components/search-input'
import ClassRoomSearchFilterInputs from '@/components/search-components/class-room-search'
import { createQueryString } from '@/utils/create-query-string'

export default function OnlineClassesPage() {
    const { payload } = useAuth();

    return (
        <ContainerLayout
            title="Live Classes"
            actionTrigger={payload?.role === Role.TEACHER && <CreateOnlineClassDialog />}
        >
            <OnlineClassesTable />
        </ContainerLayout>
    )
}

function CreateOnlineClassDialog() {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    onClick={() => setOpen(true)}
                >
                    <Plus /> Create Live Class
                </Button>
            </DialogTrigger>
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="max-w-[800px] w-[97%]">
                <DialogHeader>
                    <DialogTitle>Create Live Class</DialogTitle>
                    <DialogDescription>
                        Create a new live class by selecting your assigned class with subject and final details.
                    </DialogDescription>
                </DialogHeader>
                <CreateLiveClassForm setOpen={setOpen} />
            </DialogContent>
        </Dialog>

    )
}

function OnlineClassesTable() {
    const [searchParam] = useSearchParams();

    const { data, isLoading } = useGetOnlineClasses({
        queryString: createQueryString({
            page: searchParam.get('page'),
            take: searchParam.get('take'),
            search: searchParam.get('search'),
            classRoomId: searchParam.get('classRoomId'),
            sectionId: searchParam.get('sectionId'),
        })
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <DataTable
            columns={onlineClassesColumns}
            data={data?.data ?? []}
            meta={data?.meta}
            filters={<OnlineClassesSearchFilters />}
        />
    )
}

export const onlineClassesColumns: ColumnDef<TOnlineClass>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Title",
        accessorKey: "title",
    },

    {
        header: "Class",
        accessorKey: "classRoomName",
    },
    {
        header: "Subject",
        accessorKey: "subjectName",
    },
    {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => {
            const status = row.original.status;

            return status === EOnlineClassStatus.Scheduled
                ? (
                    <Badge variant="outline" className="whitespace-nowrap">
                        <Calendar size={18} className='mr-2' /> Scheduled
                    </Badge>
                ) : status === EOnlineClassStatus.Live
                    ? (
                        <Badge variant="destructiveOutline" className="whitespace-nowrap text-sm">
                            <Radio size={18} className='mr-2' /> Live
                        </Badge>
                    ) : status === EOnlineClassStatus.Completed
                        ? (
                            <Badge variant="success" className="whitespace-nowrap">
                                Completed
                            </Badge>
                        ) : <Badge className="whitespace-nowrap">
                            Cancelled
                        </Badge>
        }
    },
    {
        header: "Scheduled Date",
        accessorKey: "scheduledDate",
        cell: ({ row }) => {
            return row.original.scheduleDate
                ? <span>{format(row.original.scheduleDate?.slice(0, -1), "dd MMM yyyy hh:mm a")}</span>
                : <span className='text-muted-foreground italic'>** Started Immediately **</span>
        }
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const id = row.original.id;
            const navigate = useNavigate();

            function handleCopyLink() {
                navigator.clipboard.writeText(window.location.href + '/live/' + id)
                    .then(() => toast.success("Link Copied", { position: "bottom-right" }))
            }

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
                            <DropdownMenuButtonItem onClick={handleCopyLink}>
                                <Copy /><span>Copy Join Link</span>
                            </DropdownMenuButtonItem>
                            <DropdownMenuButtonItem onClick={() => navigate(`live/${id}`)}>
                                <Merge /><span>Join</span>
                            </DropdownMenuButtonItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )
        },
    },
]

function OnlineClassesSearchFilters() {
    const { payload } = useAuth()

    return payload?.role === Role.TEACHER && (
        <section className="flex flex-wrap lg:gap-5 gap-3 w-full">
            <SearchInput placeholder="Search by title" label="Title" />
            <ClassRoomSearchFilterInputs />
        </section>
    )
}