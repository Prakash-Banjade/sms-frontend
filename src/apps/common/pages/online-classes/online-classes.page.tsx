import ContainerLayout from '@/components/aside-layout.tsx/container-layout'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import CreateLiveClassForm from '../../online-classes/live-online-class/create-live-class-form'
import { BookOpen, Calendar, CalendarOff, Clapperboard, Copy, Disc, Loader2, Plus, Radio, User, Video } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { EOnlineClassStatus, TOnlineClass, useGetOnlineClasses } from '../../../teacher/data-access/online-class-data-access'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
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
import { FacetedFilter } from '@/components/data-table/faceted-filter'

export default function OnlineClassesPage() {
    const { payload } = useAuth();

    return (
        <ContainerLayout
            title="Live Classes"
            actionTrigger={payload?.role === Role.TEACHER && <CreateOnlineClassDialog />}
        >
            <section className='@container space-y-4'>
                <OnlineClassesSearchFilters />
                <OnlineClassesList />
            </section>
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

function OnlineClassesList() {
    const [searchParam] = useSearchParams();
    const navigate = useNavigate();
    const { payload } = useAuth();
    const client = useStreamVideoClient();

    const { data, isLoading } = useGetOnlineClasses({
        queryString: createQueryString({
            page: searchParam.get('page'),
            take: searchParam.get('take'),
            search: searchParam.get('search'),
            classRoomId: searchParam.get('classRoomId'),
            sectionId: searchParam.get('sectionId'),
            skipPagination: true,
            status: searchParam.get('status'),
        })
    });

    const handleLeave = (event: CustomEvent<{ id: string }>) => {
        const id = event.detail.id;

        !!id && navigate(`/${payload?.role}/live-classes/live/${id}/left`);
    }

    useEffect(() => {
        // Listen for custom events triggered from the new window
        window.addEventListener(OnlineClassNewWindowEvents.Call_Leave, e => handleLeave(e as CustomEvent));
        window.addEventListener(OnlineClassNewWindowEvents.Call_End, e => handleCallEnd(e as CustomEvent));

        return () => {
            window.removeEventListener(OnlineClassNewWindowEvents.Call_Leave, e => handleLeave(e as CustomEvent));
            window.removeEventListener(OnlineClassNewWindowEvents.Call_End, e => handleCallEnd(e as CustomEvent));
        };
    }, []);

    const { mutateAsync } = useAppMutation();

    const handleCallEnd = async (event: CustomEvent<{ id: string }>) => {
        if (!client || !event.detail.id) return;

        const { calls } = await client.queryCalls({
            filter_conditions: { id: event.detail.id },
        });

        if (!calls.length) return;

        const call = calls[0];

        await mutateAsync({
            endpoint: QueryKey.ONLINE_CLASSES + `/${event.detail.id}` + '/status',
            method: 'patch',
            data: { status: EOnlineClassStatus.Completed },
            invalidateTags: [QueryKey.ONLINE_CLASSES],
            toastOnSuccess: false,
        });

        await call.endCall();
    }

    if (isLoading) return <div>Loading...</div>;

    return (
        <section className='grid @7xl:grid-cols-4 @5xl:grid-cols-3 @2xl:grid-cols-2 gap-2'>
            {
                data?.data?.map(oc => {
                    return (
                        <Card className="w-full flex flex-col bg-secondary/10" key={oc.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-xl font-bold line-clamp-1">{oc.title}</CardTitle>
                                    {
                                        oc.status === EOnlineClassStatus.Scheduled
                                            ? (
                                                <Badge variant="default" className="whitespace-nowrap">
                                                    <Calendar size={18} className='mr-2' /> Scheduled
                                                </Badge>
                                            ) : oc.status === EOnlineClassStatus.Live
                                                ? (
                                                    <Badge variant="destructiveOutline" className="whitespace-nowrap">
                                                        <Radio size={18} className='mr-2' /> Live
                                                    </Badge>
                                                ) : oc.status === EOnlineClassStatus.Completed
                                                    ? (
                                                        <Badge variant="success" className="whitespace-nowrap">
                                                            Completed
                                                        </Badge>
                                                    ) : <Badge variant={"destructive"} className="whitespace-nowrap">
                                                        Cancelled
                                                    </Badge>
                                    }
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {
                                    payload?.role === Role.TEACHER && (
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                            <BookOpen className="h-4 w-4" />
                                            <span>{oc.classRoomName}</span>
                                        </div>
                                    )
                                }
                                {
                                    payload?.role !== Role.TEACHER && (
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                            <User className="h-4 w-4" />
                                            <span>{oc.teacherName}</span>
                                        </div>
                                    )
                                }
                                {
                                    oc.scheduleDate && (
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>{format(oc.scheduleDate.slice(0, -1), "dd MMM yyyy hh:mm a")}</span>
                                        </div>
                                    )
                                }
                                <Badge variant="outline" className="mt-2 text-base">
                                    {oc.subjectName}
                                </Badge>
                            </CardContent>
                            <CardFooter className='!mt-auto'>
                                <CardActions onlineClass={oc} />
                            </CardFooter>
                        </Card>
                    )
                })
            }
        </section>
    )
}

const CardActions = ({ onlineClass }: { onlineClass: TOnlineClass }) => {
    const [isCancelOpen, setIsCancelOpen] = useState(false);
    const [isRecordingsOpen, setIsRecordingsOpen] = useState(false);
    const { payload } = useAuth();
    const client = useStreamVideoClient();

    function handleCopyLink() {
        navigator.clipboard.writeText(window.location.href + '/live/' + onlineClass.id)
            .then(() => toast.success("Link Copied", { position: "bottom-right" }))
    }

    const { mutateAsync, isPending } = useAppMutation();

    async function handleRemove() {
        if (!client) return;

        await mutateAsync({
            endpoint: QueryKey.ONLINE_CLASSES + `/${onlineClass.id}`,
            method: 'delete',
            invalidateTags: [QueryKey.ONLINE_CLASSES],
            toastOnSuccess: false,
        });

        const { calls } = await client.queryCalls({
            filter_conditions: { id: onlineClass.id },
        });

        if (calls.length) {
            const call = calls[0];
            await call.get();
            await call.endCall();
        };
    }

    async function handleStartClass() {
        if (!client) return;

        await mutateAsync({
            endpoint: QueryKey.ONLINE_CLASSES + `/${onlineClass.id}` + '/status',
            method: 'patch',
            data: { status: EOnlineClassStatus.Live },
            invalidateTags: [QueryKey.ONLINE_CLASSES],
            toastOnSuccess: false,
        });

        openOnlineClassWindow();
    }

    const openOnlineClassWindow = async () => {
        if (!client) return;

        const newWindow = window.open(
            `${window.location.origin}/${payload?.role}/live-classes/live/${onlineClass.id}`, // Replace with your URL
            '_blank', // Open in a new tab or window
            'width=1000,height=1000' // Window features
        );

        // Ensure the new window exists before interacting with it
        if (newWindow && !newWindow.opener) {
            toast.error('Failed to open online class window. This might be due to some popup blocker in your browser.');
        }
    };

    return (
        <section className='w-full'>
            <ResponsiveAlertDialog
                isOpen={isCancelOpen}
                setIsOpen={setIsCancelOpen}
                title="Dismiss Class?"
                description="This will remove the scheduled online class."
                action={handleRemove}
                actionLabel="Dismiss"
                isLoading={isPending}
            />

            <ResponsiveDialog
                isOpen={isRecordingsOpen}
                setIsOpen={setIsRecordingsOpen}
                title='Call Recordings'
                description='View your recorded calls here.'
            >
                <CallRecordingsContainer callId={onlineClass.id} />
            </ResponsiveDialog>

            {
                [EOnlineClassStatus.Live].includes(onlineClass.status) && (
                    <section className='flex gap-1'>
                        <Button onClick={openOnlineClassWindow} disabled={isPending} className='flex-1'>
                            <Video /><span>Join</span>
                        </Button>
                        <Button type='button' title='Copy Join Link' aria-label='Copy Join Link' variant={'secondary'} onClick={handleCopyLink} disabled={isPending} size={'icon'}>
                            <Copy /><span className='sr-only'>Copy Join Link</span>
                        </Button>
                    </section>
                )
            }
            {
                payload?.role === Role.TEACHER && onlineClass.status === EOnlineClassStatus.Scheduled && (
                    <section className='flex gap-1'>
                        {
                            !!onlineClass.scheduleDate && isBefore(onlineClass.scheduleDate?.slice(0, -1), new Date()) && (
                                <Button onClick={handleStartClass} disabled={isPending} className='flex-1'>
                                    <Clapperboard /><span>Start Class</span>
                                </Button>
                            )
                        }
                        <Button variant={"destructive"} onClick={() => setIsCancelOpen(true)} disabled={isPending} className='flex-1'>
                            <CalendarOff /><span>Dismiss Class</span>
                        </Button>
                    </section>
                )
            }
            {
                onlineClass.status === EOnlineClassStatus.Completed && (
                    <Button type='button' variant={'secondary'} onClick={() => setIsRecordingsOpen(true)} disabled={isPending} className='w-full'>
                        <Disc /><span>View Recordings</span>
                    </Button>
                )
            }
        </section>
    )
}

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
                            {format(recording.end_time, "dd MMM yyyy hh:mm:ss a")}
                        </a>
                    </li>
                ))}
        </ul>
    )
}

function OnlineClassesSearchFilters() {
    const { payload } = useAuth()

    return (
        <section className='flex gap-2 lg:gap-5 flex-wrap justify-between items-end'>
            {
                payload?.role === Role.TEACHER && (
                    <section className="flex flex-wrap lg:gap-5 gap-3">
                        <SearchInput placeholder="Search by title" label="Title" />
                        <ClassRoomSearchFilterInputs />
                    </section>
                )
            }

            <FacetedFilter title="Status" searchKey="status" options={Object.entries(EOnlineClassStatus).map(([key, value]) => ({ label: key, value }))} />
        </section>
    )
}