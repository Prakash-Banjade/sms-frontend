import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-provider";
import { getErrMsg } from "@/lib/utils";
import { QueryKey } from "@/react-query/queryKeys";
import { useAxios } from "@/services/api";
import { startAuthentication } from "@simplewebauthn/browser";
import { KeyRound } from "lucide-react";
import { useState } from "react";

type Props = {
    setIsVerified: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ConfirmByPasskey({ setIsVerified }: Props) {
    const axios = useAxios();
    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState<boolean>(false);
    const { payload } = useAuth();

    const handleLoginWithPassKey = async () => {
        setError(null);
        setIsPending(true);
        try {
            const response = await axios.post(`/${QueryKey.WEB_AUTHN}/auth-challenge`, {
                email: payload?.email,
                type: 'sudo', // challenge type
            });

            const challengePayload = response.data?.challengePayload;

            if (!challengePayload) throw new Error('Something seems wrong. Please try again.');

            try {
                const authenticationResponse = await startAuthentication({ optionsJSON: challengePayload });

                const res = await axios.post(`/${QueryKey.WEB_AUTHN}/verify-sudo`, {
                    authenticationResponse,
                });

                if (res.data?.verified === true) {
                    setIsVerified(true);
                } else {
                    throw new Error('Something seems wrong. Please try again.')
                }

            } catch (e) {
                if (e instanceof Error) {
                    if (e.message.includes('timed out')) {
                        setError('Authentication cancelled or timeout.')
                    } else {
                        setError(e.message)
                    }
                };
                setError(getErrMsg(e) ?? 'Something went wrong. Please try again.');
            }

        } catch (e) {
            setError(getErrMsg(e) || 'Something seems wrong. Please try again.')
        } finally {
            setIsPending(false);
        }
    }

    return (
        <div className="flex flex-col items-center gap-4 text-center">
            <KeyRound className="w-8 h-8 text-muted-foreground" />
            <h2 className="text-xl">Passkey</h2>
            <p className="text-sm text-muted-foreground">
                When you are ready, authenticate using the button below.
            </p>
            <Button type="button" className="w-full" onClick={handleLoginWithPassKey} disabled={isPending}>
                Use passkey
            </Button>
            {
                error && <p className="text-sm text-destructive">{error}</p>
            }
        </div>
    )
}