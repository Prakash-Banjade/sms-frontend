import ContainerLayout from '@/components/aside-layout.tsx/container-layout'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import CreateLiveClassForm from '../../online-classes/live-online-class/create-live-class-form'
import { Calendar, CalendarOff, Clapperboard, Copy, Disc, Loader2, Merge, MoreHorizontal, Plus, Radio } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { EOnlineClassStatus, TOnlineClass, useGetOnlineClasses } from '../../../teacher/data-access/online-class-data-access'
import { DataTable } from '@/components/data-table/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { DestructiveDropdownMenuButtonItem, DropdownMenu, DropdownMenuButtonItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import toast from 'react-hot-toast'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { format, isBefore } from 'date-fns'
import { useAuth } from '@/contexts/auth-provider'
import { Role } from '@/types/global.type'
import SearchInput from '@/components/search-components/search-input'
import ClassRoomSearchFilterInputs from '@/components/search-components/class-room-search'
import { createQueryString } from '@/utils/create-query-string'
import { useAppMutation } from '@/hooks/useAppMutation'
import { ResponsiveAlertDialog } from '@/components/ui/responsive-alert-dialog'
import useLoadCall from '@/hooks/useLoadCall'
import { QueryKey } from '@/react-query/queryKeys'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import useLoadRecordings from '@/hooks/useLoadRecordings'
import { ResponsiveDialog } from '@/components/ui/responsive-dialog'
import { OnlineClassNewWindowEvents } from '../../online-classes/live-online-class/flexible-layout'

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
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="max-w-[800px] w-[97%] max-h-[95vh] overflow-auto">
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
    const navigate = useNavigate();
    const { payload } = useAuth();

    const { data, isLoading } = useGetOnlineClasses({
        queryString: createQueryString({
            page: searchParam.get('page'),
            take: searchParam.get('take'),
            search: searchParam.get('search'),
            classRoomId: searchParam.get('classRoomId'),
            sectionId: searchParam.get('sectionId'),
        })
    });

    const handleLeave = (event: CustomEvent<{ id: string }>) => {
        const id = event.detail.id;

        !!id && navigate(`/${payload?.role}/live-classes/live/${id}/left`);
    }


    useEffect(() => {
        // Listen for custom events triggered from the new window
        window.addEventListener(OnlineClassNewWindowEvents.Call_Leave, e => handleLeave(e as CustomEvent));

        return () => {
            window.removeEventListener(OnlineClassNewWindowEvents.Call_Leave, e => handleLeave(e as CustomEvent));
        };
    }, []);

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
            const [isCancelOpen, setIsCancelOpen] = useState(false);
            const [isRecordingsOpen, setIsRecordingsOpen] = useState(false);
            const { payload } = useAuth();
            const client = useStreamVideoClient();

            function handleCopyLink() {
                navigator.clipboard.writeText(window.location.href + '/live/' + id)
                    .then(() => toast.success("Link Copied", { position: "bottom-right" }))
            }

            const { mutateAsync, isPending } = useAppMutation();

            async function handleCancelClass() {
                if (!client) return;

                const { calls } = await client.queryCalls({
                    filter_conditions: { id },
                });

                if (!calls.length) return;

                const call = calls[0];

                await call.get();

                call.endCall().then(async () => {
                    await mutateAsync({
                        endpoint: QueryKey.ONLINE_CLASSES + `/${call.id}` + '/status',
                        method: 'patch',
                        data: { status: EOnlineClassStatus.Cancelled },
                        invalidateTags: [QueryKey.ONLINE_CLASSES],
                        toastOnSuccess: false,
                    });
                    call.leave();
                }).catch(() => {
                    toast.error('Failed to dismiss class');
                })
            }

            async function handleStartClass() {
                await mutateAsync({
                    endpoint: QueryKey.ONLINE_CLASSES + `/${id}` + '/status',
                    method: 'patch',
                    data: { status: EOnlineClassStatus.Live },
                    invalidateTags: [QueryKey.ONLINE_CLASSES],
                    toastOnSuccess: false,
                });

                openOnlineClassWindow();
            }

            const openOnlineClassWindow = () => {
                const newWindow = window.open(
                    `${window.location.origin}/${payload?.role}/live-classes/live/${id}`, // Replace with your URL
                    '_blank', // Open in a new tab or window
                    'width=1000,height=1000' // Window features
                );

                // Ensure the new window exists before interacting with it
                if (newWindow && !newWindow.opener) {
                    toast.error('Failed to open online class window. This might be due to some popup blocker in your browser.');
                }
            };


            return (
                <>
                    <ResponsiveAlertDialog
                        isOpen={isCancelOpen}
                        setIsOpen={setIsCancelOpen}
                        title="Dismiss Class?"
                        description="This will dismiss the class and mark as cancelled."
                        action={handleCancelClass}
                        actionLabel="End call"
                        isLoading={isPending}
                    />

                    <ResponsiveDialog
                        isOpen={isRecordingsOpen}
                        setIsOpen={setIsRecordingsOpen}
                        title='Call Recordings'
                        description='View your recorded calls here.'
                    >
                        <CallRecordingsContainer callId={id} />
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
                                [EOnlineClassStatus.Live].includes(row.original.status) && (
                                    <>
                                        <DropdownMenuButtonItem onClick={handleCopyLink} disabled={isPending}>
                                            <Copy /><span>Copy Join Link</span>
                                        </DropdownMenuButtonItem>
                                        <DropdownMenuButtonItem onClick={openOnlineClassWindow} disabled={isPending}>
                                            <Merge /><span>Join</span>
                                        </DropdownMenuButtonItem>
                                    </>
                                )
                            }
                            {
                                payload?.role === Role.TEACHER && row.original.status === EOnlineClassStatus.Scheduled && (
                                    <>
                                        {
                                            !!row.original.scheduleDate && isBefore(row.original.scheduleDate?.slice(0, -1), new Date()) && <DropdownMenuButtonItem onClick={handleStartClass} disabled={isPending}>
                                                <Clapperboard /><span>Start Class</span>
                                            </DropdownMenuButtonItem>
                                        }
                                        <DestructiveDropdownMenuButtonItem onClick={() => setIsCancelOpen(true)} disabled={isPending}>
                                            <CalendarOff /><span>Dismiss Class</span>
                                        </DestructiveDropdownMenuButtonItem>
                                    </>
                                )
                            }
                            {
                                row.original.status === EOnlineClassStatus.Completed && (
                                    <DropdownMenuButtonItem onClick={() => setIsRecordingsOpen(true)} disabled={isPending}>
                                        <Disc /><span>View Recordings</span>
                                    </DropdownMenuButtonItem>
                                )
                            }
                        </DropdownMenuContent>
                    </DropdownMenu >
                </>
            )
        },
    },
];

const CallRecordingsContainer = ({ callId }: { callId: string }) => {
    const { call } = useLoadCall(callId);

    if (!call) return null;

    return <CallRecordings call={call} />
}

const CallRecordings = ({ call }: { call: Call }) => {
    const { recordings, recordingsLoading } = useLoadRecordings(call);

    if (recordingsLoading) return <Loader2 className="mx-auto animate-spin" />;

    if (recordings.length === 0) return (
        <p className='my-2 text-muted-foreground'>No recordings for this class.</p>
    );

    return (
        <ul className="list-inside list-disc py-3">
            {recordings
                .sort((a, b) => b.end_time.localeCompare(a.end_time))
                .map((recording) => (
                    <li key={recording.url}>
                        <a
                            href={recording.url}
                            target="_blank"
                            className="hover:underline"
                        >
                            {new Date(recording.end_time).toLocaleString()}
                        </a>
                    </li>
                ))}
        </ul>
    )
}

function OnlineClassesSearchFilters() {
    const { payload } = useAuth()

    return payload?.role === Role.TEACHER && (
        <section className="flex flex-wrap lg:gap-5 gap-3 w-full">
            <SearchInput placeholder="Search by title" label="Title" />
            <ClassRoomSearchFilterInputs />
        </section>
    )
}