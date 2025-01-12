import { EOnlineClassStatus } from "@/apps/teacher/data-access/online-class-data-access";
import { useAppMutation } from "@/hooks/useAppMutation";
import useStreamCall from "@/hooks/useStreamCall";
import { QueryKey } from "@/react-query/queryKeys";
import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function EndCallButton() {
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
        <button
            type="button"
            onClick={handleCallEnd}
            className="mx-auto block font-medium text-destructive hover:underline"
            disabled={isPending}
        >
            {
                isPending
                    ? <LoaderCircle className="animate-spin" />
                    : "End call for everyone"
            }
        </button>
    );
}