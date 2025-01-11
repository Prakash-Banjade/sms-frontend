import React, { useEffect, useState } from "react";
import { useAuth } from "./auth-provider"
import { StreamVideo, StreamVideoClient } from '@stream-io/video-react-sdk';
import { useAxios } from "@/services/api";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
    const videoClient = useInitializedVideoClient();

    if (!videoClient) return null;

    return (
        <StreamVideo client={videoClient}>
            {children}
        </StreamVideo>
    )
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
    }, []);

    return videoClient;
}