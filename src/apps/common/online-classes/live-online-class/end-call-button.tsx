import { Button } from "@/components/ui/button";
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog";
import useStreamCall from "@/hooks/useStreamCall";
import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { LoaderCircle, PhoneOff } from "lucide-react";
import { useState, useTransition } from "react";
import { OnlineClassNewWindowEvents } from "./flexible-layout";

export default function EndCallButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const call = useStreamCall();

    const { useLocalParticipant } = useCallStateHooks();
    const localParticipant = useLocalParticipant();


    const participantIsChannelOwner =
        localParticipant &&
        call.state.createdBy &&
        localParticipant.userId === call.state.createdBy.id;

    const handleCallEnd = () => {
        startTransition(() => {
            if (window.opener) {
                // Trigger a custom event on the main window
                const event = new CustomEvent(OnlineClassNewWindowEvents.Call_End, {
                    detail: {
                        id: call.id,
                    }
                });
                window.opener.dispatchEvent(event);
                window.close();
            } else {
                console.warn('No opener window found');
            }
        });
    }

    if (!participantIsChannelOwner) {
        return null;
    }

    return (
        <>
            <ResponsiveAlertDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="End call for everyone"
                description="This will end the call for every participants and mark the class as completed."
                action={handleCallEnd}
                actionLabel="End call"
                loadingText="Ending call..."
                isLoading={isPending}
            />
            <Button
                variant={'destructive'}
                type="button"
                disabled={isPending}
                onClick={() => setIsOpen(true)}
                className="mx-auto flex"
            >
                {
                    isPending
                        ? <LoaderCircle className="animate-spin" />
                        : <>
                            <PhoneOff />
                            End call for everyone
                        </>
                }
            </Button>
        </>
    );
}