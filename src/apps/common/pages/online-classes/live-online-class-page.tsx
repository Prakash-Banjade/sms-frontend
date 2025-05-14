import { Button } from "@/components/ui/button";
import { CallingState, DeviceSettings, StreamCall, StreamTheme, useCallStateHooks, VideoPreview } from "@stream-io/video-react-sdk";
import { useNavigate, useParams } from "react-router-dom"
import "@stream-io/video-react-sdk/dist/css/styles.css";
import useLoadCall from "@/hooks/useLoadCall";
import { ONLINE_CLASS_CALL_TYPE } from "../../online-classes/create-live-class-form/create-live-class-form";
import { useAuth } from "@/contexts/auth-provider";
import useStreamCall from "@/hooks/useStreamCall";
import { ArrowLeft, CheckCircle, Clock, FileText, FileVideo2, Loader2, MessageCircle, VideoOff } from "lucide-react";
import { useEffect, useState } from "react";
import AudioVolumeIndicator from "../../online-classes/live-online-class/audio-volume-indicator";
import FlexibleCallLayout, { OnlineClassNewWindowEvents } from "../../online-classes/live-online-class/flexible-layout";
import { format } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox";
import { CallRecordingList } from "./call-left.page";
import { EOnlineClassStatus, useGetOnlineClass } from "../../../teacher/data-access/online-class-data-access";
import AccessBlockedWarning from "../../online-classes/live-online-class/mic-cam-access-blocked-wraning";
import toast from "react-hot-toast";

export default function LiveOnlineClassPageWrapper() {
    const { id } = useParams();

    const { data: onlineClass, isLoading } = useGetOnlineClass({ id: id!, options: { enabled: !!id } });

    if (isLoading) return <div>Loading...</div>;

    if (onlineClass && onlineClass?.status !== EOnlineClassStatus.Live) return <ClassNotStartedByTeacher />;

    if (!onlineClass) return <CallNotFound />;

    return <section className="sm:py-8 py-4 sm:px-4 px-2">
        <LiveOnlineClassPage />
    </section>
}

export function LiveOnlineClassPage() {
    const { id } = useParams();
    const { payload } = useAuth();

    const { call, callLoading } = useLoadCall(id!);

    if (callLoading) return <div>Loading...</div>;

    if (!call) return <CallNotFound />;

    const notAllowedToJoin = call.type === ONLINE_CLASS_CALL_TYPE && call.state.members.findIndex((member) => member.user_id === payload?.accountId) === -1;

    if (notAllowedToJoin) return (
        <div className="flex flex-col items-center justify-center py-20">
            <h1>You are not allowed to join this call</h1>
            <p>If you think this is an error, please contact the teacher</p>
        </div>
    );

    return (
        <StreamCall call={call}>
            <StreamTheme>
                <ClassScreen />
            </StreamTheme>
        </StreamCall>
    );
}

function ClassScreen() {
    const call = useStreamCall();
    const { payload } = useAuth();

    const { useCallEndedAt, useCallStartsAt, useParticipants } = useCallStateHooks();
    const participants = useParticipants();

    const callEndedAt = useCallEndedAt();
    const callStartsAt = useCallStartsAt();

    const [setupComplete, setSetupComplete] = useState(false);

    async function handleSetupComplete() {
        call.join();
        setSetupComplete(true);
    }

    const callIsInFuture = callStartsAt && new Date(callStartsAt) > new Date();

    const callHasEnded = !!callEndedAt;

    const hasAlreadyParticipated = participants.filter((participant) => participant.userId === payload?.accountId).length > 1;

    if (callHasEnded) {
        return <ClassEndedScreen />;
    }

    if (callIsInFuture) {
        return <UpcomingClassScreen />;
    }

    if (hasAlreadyParticipated) {
        return <AlreadyParticipatedScreen />;
    }

    return (
        <div className="space-y-6">
            {setupComplete ? (
                <section className="container mx-auto">
                    <CallUI />
                </section>
            ) : (
                <SetupUI onSetupComplete={handleSetupComplete} />
            )}
        </div>
    );
}

interface SetupUIProps {
    onSetupComplete: () => void;
}

function SetupUI({ onSetupComplete }: SetupUIProps) {
    const call = useStreamCall();

    const { useMicrophoneState, useCameraState } = useCallStateHooks();

    const micState = useMicrophoneState();
    const camState = useCameraState();

    const [micCamDisabled, setMicCamDisabled] = useState(false);

    useEffect(() => {
        if (micCamDisabled) {
            call.camera.disable();
            call.microphone.disable();
        } else {
            call.camera.enable();
            call.microphone.enable();
        }
    }, [micCamDisabled, call]);

    const handleRetry = () => {
        if (!micState.hasBrowserPermission || !camState.hasBrowserPermission) {
            return toast.error('Please allow microphone and camera permissions');
        }

        onSetupComplete();
    }

    if (!micState.hasBrowserPermission || !camState.hasBrowserPermission) {
        return <AccessBlockedWarning onRetry={handleRetry} />;
    }

    return (
        <div className="flex flex-col items-center gap-3">
            <h1 className="text-center text-2xl font-bold">
                Setup your camera and microphone
            </h1>
            <VideoPreview />
            <div className="flex h-16 items-center gap-3">
                <AudioVolumeIndicator />
                {
                    !micCamDisabled && <DeviceSettings />
                }
            </div>
            <label className="flex items-center gap-2 font-medium">
                <Checkbox
                    checked={micCamDisabled}
                    onCheckedChange={val => setMicCamDisabled(val === true)}
                />
                Join with mic and camera off
            </label>
            <Button onClick={onSetupComplete}>Join Class</Button>
        </div>
    );
}

function CallUI() {
    const { useCallCallingState } = useCallStateHooks();

    const callingState = useCallCallingState();

    if (callingState !== CallingState.JOINED) {
        return <Loader2 className="mx-auto animate-spin" />;
    }

    return <FlexibleCallLayout />;
}

function UpcomingClassScreen() {
    const call = useStreamCall();
    const { payload } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="py-10">
            <Card className="w-full max-w-md mx-auto border-none">
                <CardContent className="text-center space-y-4 pt-6">
                    <div className="text-6xl text-muted-foreground mb-4">
                        <Clock className="inline-block w-16 h-16" />
                    </div>
                    <p className="text-lg font-medium">The class has not started yet.</p>
                    {call.state.startsAt ? (
                        <>
                            <p className="text-sm text-muted-foreground">
                                This class is scheduled to begin on:
                            </p>
                            <p className="text-lg font-semibold">
                                {format(call.state.startsAt, "dd MMM yyyy hh:mm a")}
                            </p>
                        </>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            The start date for this class has not been set.
                        </p>
                    )}
                </CardContent>
                <CardFooter className="justify-center">
                    <Button onClick={() => navigate(`/${payload?.role}/live-classes`)} variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

function ClassEndedScreen() {
    const { payload } = useAuth();
    const { id } = useParams();

    const navigate = useNavigate();

    const { call } = useLoadCall(id!);

    useEffect(() => {
        if (window.opener) {
            // Trigger a custom event on the main window to invalidate the online class list
            const event = new CustomEvent(OnlineClassNewWindowEvents.Update_Classes);
            window.opener.dispatchEvent(event);
            window.close();
        } else {
            console.warn('No opener window found');
        }
    }, [])

    return (
        <Card className="w-full max-w-2xl mx-auto border-none">
            <CardContent className="text-center space-y-4 pt-6">
                <div className="text-6xl text-green-500 mb-4">
                    <CheckCircle className="inline-block w-16 h-16" />
                </div>
                <p className="text-lg font-medium">The class has ended.</p>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <section className="space-y-2 max-w-md mx-auto">
                    <Button className="w-full">
                        <FileText className="mr-2 h-4 w-4" /> View Class Resources
                    </Button>
                    <Button variant="outline" className="w-full">
                        <MessageCircle className="mr-2 h-4 w-4" /> Join Discussion Forum
                    </Button>
                    <Button onClick={() => navigate(`/${payload?.role}/live-classes`)} variant="ghost" className="w-full">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                    </Button>
                </section>
                {
                    call && <CallRecordingList call={call} />
                }
            </CardFooter>
        </Card>
    );
}

function CallNotFound() {
    const { payload } = useAuth();

    const navigate = useNavigate();

    return (
        <Card className="w-full max-w-xl mx-auto py-10 border-none">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Call Not Found</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <div className="text-6xl text-muted-foreground mb-4">
                    <VideoOff className="inline-block w-16 h-16" />
                </div>
                <p className="text-lg font-medium">Oops! The call you're looking for doesn't exist.</p>
                <p className="text-sm text-muted-foreground">
                    This call may have ended or the link you followed might be incorrect.
                </p>
            </CardContent>
            <CardFooter className="justify-center">
                <Button onClick={() => navigate(`/${payload?.role}/live-classes`)} variant="ghost" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                </Button>
            </CardFooter>
        </Card>

    )
}

const ClassNotStartedByTeacher = () => {
    const { payload } = useAuth();

    const navigate = useNavigate();

    return (
        <Card className="w-full max-w-xl mx-auto py-10 border-none">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Class Not Started</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <div className="text-6xl text-muted-foreground mb-4">
                    <VideoOff className="inline-block w-16 h-16" />
                </div>
                <p className="text-lg font-medium">This call has not started yet.</p>
                <p className="text-sm text-muted-foreground">
                    The teacher has not yet started the class.
                </p>
            </CardContent>
            <CardFooter className="justify-center">
                <Button onClick={() => navigate(`/${payload?.role}/live-classes`)} variant="ghost" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                </Button>
            </CardFooter>
        </Card>
    )
}

const AlreadyParticipatedScreen = () => {
    return (
        <Card className="w-full max-w-xl mx-auto py-10 border-none">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Duplicate Entry</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <div className="text-6xl text-muted-foreground mb-4">
                    <FileVideo2 className="inline-block w-16 h-16" />
                </div>
                <p className="text-lg font-medium">You are already a participant of this call.</p>
                <p className="text-sm text-muted-foreground">
                    Cannot join again. Please contact technical support if needed.
                </p>
            </CardContent>
        </Card>
    )
}