import { EOnlineClassStatus } from "@/apps/teacher/data-access/online-class-data-access";
import { Button } from "@/components/ui/button";
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog";
import { useAppMutation } from "@/hooks/useAppMutation";
import useStreamCall from "@/hooks/useStreamCall";
import { QueryKey } from "@/react-query/queryKeys";
import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { LoaderCircle, PhoneOff } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function EndCallButton() {
    const [isOpen, setIsOpen] = useState(false);

    const call = useStreamCall();

    const { useLocalParticipant } = useCallStateHooks();
    const localParticipant = useLocalParticipant();

    const { mutateAsync, isPending } = useAppMutation();

    const participantIsChannelOwner =
        localParticipant &&
        call.state.createdBy &&
        localParticipant.userId === call.state.createdBy.id;

    if (!participantIsChannelOwner) {
        return null;
    }

    const handleCallEnd = () => {
        call.endCall().then(async () => {
            await mutateAsync({
                endpoint: QueryKey.ONLINE_CLASSES + `/${call.id}` + '/status',
                method: 'patch',
                data: { status: EOnlineClassStatus.Completed },
                invalidateTags: [QueryKey.ONLINE_CLASSES],
                toastOnSuccess: false,
            });
            call.leave();
        }).catch(() => {
            toast.error('Failed to end call');
        })
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