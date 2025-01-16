import React, { useEffect, useState } from "react";
import { useAuth } from "./auth-provider"
import { Call, StreamVideo, StreamVideoClient } from '@stream-io/video-react-sdk';
import { useAxios } from "@/services/api";

type TStreamClientContext = {
    runningCall: Call | undefined;
    setRunningCall: React.Dispatch<React.SetStateAction<Call | undefined>>;
}

const StreamClientContext = React.createContext<TStreamClientContext | null>(null);

export default function ClientProvider({ children }: { children: React.ReactNode }) {
    const videoClient = useInitializedVideoClient();
    const [runningCall, setRunningCall] = useState<Call | undefined>(undefined);

    if (!videoClient) return null;

    return (
        <StreamVideo client={videoClient}>
            <StreamClientContext.Provider value={{ runningCall, setRunningCall }}>
                {children}
            </StreamClientContext.Provider>
        </StreamVideo>
    )
}

export const useStreamClientContext = () => {
    const context = React.useContext(StreamClientContext);
    if (!context) {
        throw new Error("useStreamClientContext must be used within a StreamClientProvider");
    }

    return context;
}

export const useInitializedVideoClient = () => {
    const axios = useAxios();
    const { payload, access_token } = useAuth();
    const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);

    useEffect(() => {
        if (!payload || !access_token) return;

        const client = new StreamVideoClient({
            apiKey: import.meta.env.VITE_STREAM_VIDEO_API_KEY,
            user: {
                id: payload.accountId,
                image: payload.profileImageUrl ?? undefined,
                name: `${payload.firstName} ${payload.lastName}`,
                type: "authenticated",

            },
            tokenProvider: async () => await axios.get("/accounts/get-stream-token").then((res) => res.data),
        });

        setVideoClient(client);

        return () => { // clean up function to avoid multiple instances of user to connect
            client.disconnectUser(); // disconnect the user
            setVideoClient(null);
        }
    }, [window.opener]);

    return videoClient;
}