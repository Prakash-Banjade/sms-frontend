import { Progress } from "@/components/ui/progress";
import { createSoundDetector, useCallStateHooks } from "@stream-io/video-react-sdk";
import { Mic } from "lucide-react";
import { useEffect, useState } from "react";

export default function AudioVolumeIndicator() {
    const { useMicrophoneState } = useCallStateHooks();
    const { isEnabled, mediaStream } = useMicrophoneState();
    const [audioLevel, setAudioLevel] = useState(0);

    useEffect(() => {
        if (!isEnabled || !mediaStream) return;

        const disposeSoundDetector = createSoundDetector(
            mediaStream,
            ({ audioLevel: al }) => setAudioLevel(al),
            { detectionFrequencyInMs: 80, destroyStreamOnStop: false },
        );

        return () => {
            disposeSoundDetector().catch(console.error);
        };
    }, [isEnabled, mediaStream]);

    if (!isEnabled) return null;

    return (
        <div className="flex w-72 items-center gap-3 rounded-md p-4">
            <Mic size={24} />
            <Progress value={audioLevel} className="h-2" />
        </div>
    );
}