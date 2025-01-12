import { useAuth } from "@/contexts/auth-provider";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export default function useLoadRecordings(call: Call) {
    const { payload } = useAuth();

    const [recordings, setRecordings] = useState<CallRecording[]>([]);
    const [recordingsLoading, setRecordingsLoading] = useState(true);

    useEffect(() => {
        async function loadRecordings() {
            setRecordingsLoading(true);

            if (!payload?.accountId) return;

            const { recordings } = await call.queryRecordings();
            setRecordings(recordings);

            setRecordingsLoading(false);
        }

        loadRecordings();
    }, [call]);

    return { recordings, recordingsLoading };
}