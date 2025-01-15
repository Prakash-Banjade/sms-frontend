import { CallControls, CallParticipantsList, PaginatedGridLayout, SpeakerLayout } from "@stream-io/video-react-sdk";
import { BetweenHorizonalEnd, BetweenVerticalEnd, LayoutGrid, User } from "lucide-react";
import { useEffect, useState } from "react";
import EndCallButton from "./end-call-button";
import { useNavigate, useParams } from "react-router-dom";
import { TooltipWrapper } from "@/components/ui/tooltip";
import { useGetOnlineClass } from "@/apps/teacher/data-access/online-class-data-access";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import './style.css'

type CallLayout = "speaker-vert" | "speaker-horiz" | "grid";

export enum OnlineClassNewWindowEvents {
    Call_Leave = 'call-leave',
    Call_End = 'call-end',
}

export default function FlexibleCallLayout() {
    const { id } = useParams();
    const [layout, setLayout] = useState<CallLayout>("speaker-vert");

    function onCallLeave() { // will be triggered from the new window, opener is `online-classes.page.tsx`
        if (window.opener) {
            // Trigger a custom event on the main window
            const event = new CustomEvent(OnlineClassNewWindowEvents.Call_Leave, { detail: { id } });
            window.opener.dispatchEvent(event);
            window.close();
        } else {
            console.warn('No opener window found');
        }
    }

    return (
        <div className="space-y-3">
            <CallLayoutButtons layout={layout} setLayout={setLayout} />
            <CallLayoutView layout={layout} />
            <CallControls onLeave={onCallLeave} />
            <EndCallButton />
            <section className="@container !mt-10">
                <section className="@4xl:flex gap-6 hidden">
                    <section className="grow">
                        <OnlineClassDetails />
                    </section>
                    <div className="border rounded-lg p-3 grow max-w-[400px]">
                        <CallParticipantsList onClose={() => { }} />
                    </div>
                </section>
                <section className="@4xl:hidden">
                    <Tabs defaultValue="details">
                        <TabsList className="flex">
                            <TabsTrigger value="details" className="flex-1">Class Details</TabsTrigger>
                            <TabsTrigger value="participants" className="flex-1">Participants</TabsTrigger>
                        </TabsList>
                        <TabsContent value="details">
                            <OnlineClassDetails />
                        </TabsContent>
                        <TabsContent value="participants" className="pt-3">
                            <CallParticipantsList onClose={() => { }} />
                        </TabsContent>
                    </Tabs>
                </section>
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

function CallLayoutView({ layout }: { layout: CallLayout }) {
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
                <div className="flex justify-between items-start flex-wrap gap-1">
                    <div>
                        <CardTitle className="sm:text-2xl text-lg font-bold sm:mb-2">{onlineClass.title}</CardTitle>
                        <h2 className="sm:text-xl text-base text-muted-foreground">{onlineClass.subject?.subjectName}</h2>
                    </div>
                    <Badge variant="secondary" className="sm:text-sm">
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
                    <h3 className="sm:text-lg text-base font-semibold mb-2">Description</h3>
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