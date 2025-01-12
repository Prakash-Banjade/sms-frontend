import { CallControls, CallParticipantsList, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from "@stream-io/video-react-sdk";
import { BetweenHorizonalEnd, BetweenVerticalEnd, LayoutGrid, User } from "lucide-react";
import { useEffect, useState } from "react";
import EndCallButton from "./end-call-button";
import { useNavigate, useParams } from "react-router-dom";
import { TooltipWrapper } from "@/components/ui/tooltip";
import { EOnlineClassStatus, useGetOnlineClass } from "@/apps/teacher/data-access/online-class-data-access";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton";
import { QueryKey } from "@/react-query/queryKeys";
import { useAppMutation } from "@/hooks/useAppMutation";
import useStreamCall from "@/hooks/useStreamCall";

type CallLayout = "speaker-vert" | "speaker-horiz" | "grid";

export default function FlexibleCallLayout() {
    const [layout, setLayout] = useState<CallLayout>("speaker-vert");
    const navigate = useNavigate();
    const call = useStreamCall();
    const { mutateAsync } = useAppMutation();
    const { useLocalParticipant } = useCallStateHooks();
    const localParticipant = useLocalParticipant();

    // once the component is mounted, we start the call as live
    useEffect(() => {
        const participantIsChannelOwner =
            localParticipant &&
            call.state.createdBy &&
            localParticipant.userId === call.state.createdBy.id;

        if (!participantIsChannelOwner) return;

        mutateAsync({
            endpoint: QueryKey.ONLINE_CLASSES + `/${call.id}` + '/status',
            method: 'patch',
            data: { status: EOnlineClassStatus.Live },
            invalidateTags: [QueryKey.ONLINE_CLASSES],
            toastOnSuccess: false,
        });
    }, []);

    return (
        <div className="space-y-3">
            <CallLayoutButtons layout={layout} setLayout={setLayout} />
            <CallLayoutView layout={layout} />
            <CallControls onLeave={() => navigate('left')} />
            <EndCallButton />
            <section className="flex gap-6 mt-10">
                <section className="grow">
                    <OnlineClassDetails />
                </section>
                <div className="border rounded-lg p-3 grow max-w-[400px]">
                    <CallParticipantsList onClose={() => { }} />
                </div>
            </section>
        </div>
    );
}

interface CallLayoutButtonsProps {
    layout: CallLayout;
    setLayout: (layout: CallLayout) => void;
}

function CallLayoutButtons({ layout, setLayout }: CallLayoutButtonsProps) {
    return (
        <div className="mx-auto w-fit flex gap-6">
            <TooltipWrapper label="Speaker vertical">
                <button onClick={() => setLayout("speaker-vert")}>
                    <BetweenVerticalEnd
                        className={layout !== "speaker-vert" ? "text-gray-400" : ""}
                    />
                </button>
            </TooltipWrapper>

            <TooltipWrapper label="Speaker horizontal">
                <button onClick={() => setLayout("speaker-horiz")}>
                    <BetweenHorizonalEnd
                        className={layout !== "speaker-horiz" ? "text-gray-400" : ""}
                    />
                </button>
            </TooltipWrapper>

            <TooltipWrapper label="Grid">
                <button onClick={() => setLayout("grid")}>
                    <LayoutGrid className={layout !== "grid" ? "text-gray-400" : ""} />
                </button>
            </TooltipWrapper>
        </div>
    );
}

interface CallLayoutViewProps {
    layout: CallLayout;
}

function CallLayoutView({ layout }: CallLayoutViewProps) {
    if (layout === "speaker-vert") {
        return <SpeakerLayout />;
    }

    if (layout === "speaker-horiz") {
        return <SpeakerLayout participantsBarPosition="right" />;
    }

    if (layout === "grid") {
        return <PaginatedGridLayout />;
    }

    return null;
}

function OnlineClassDetails() {
    const { id } = useParams();

    const { data: onlineClass, isLoading } = useGetOnlineClass({ id: id!, options: { enabled: !!id } });

    if (isLoading) return <ClassDetailsLoadingSkeleton />;

    if (!onlineClass) return null;

    const classRoomName = onlineClass?.classRoom.parent?.id
        ? `${onlineClass.classRoom.parent?.name} - ${onlineClass.classRoom.name}`
        : onlineClass.classRoom.name;

    const teacherName = `${onlineClass.teacher.firstName} ${onlineClass.teacher.lastName}`;

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-2xl font-bold mb-2">{onlineClass.title}</CardTitle>
                        <h2 className="text-xl text-muted-foreground">{onlineClass.subject?.subjectName}</h2>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                        {classRoomName}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Instructor: {teacherName}</span>
                </div>
                <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{onlineClass.description}</p>
                </div>
            </CardContent>
        </Card>
    )
}

function ClassDetailsLoadingSkeleton() {
    return (
        <Card className="w-full max-w-4xl mx-auto !mt-10">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-40" />
                </div>
                <div className="border-t pt-4 space-y-2">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </CardContent>
        </Card>
    )
}