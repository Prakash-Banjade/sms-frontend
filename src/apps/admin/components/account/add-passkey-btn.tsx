import { Button } from "@/components/ui/button";
import { useAxios } from "@/services/api";
import { Plus } from "lucide-react";
import { startRegistration } from '@simplewebauthn/browser';
import { useState } from "react";
import toast from "react-hot-toast";
import { QueryKey } from "@/react-query/queryKeys";
import { useQueryClient } from "@tanstack/react-query";

export default function AddPassKeyBtn() {
    const axios = useAxios();
    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const handleAddPassKey = async () => {
        setError(null);
        setIsPending(true);
        try {
            const response = await axios.post(`/${QueryKey.WEB_AUTHN}/register`);

            const challengePayload = response.data?.challengePayload;

            if (!challengePayload) throw new Error('Failed to register passkey'); // todo: show some error msg

            try {
                const registrationResponse = await startRegistration({ optionsJSON: challengePayload, useAutoRegister: true });

                const response = await axios.post(`/${QueryKey.WEB_AUTHN}/verify-register`, {
                    registrationResponse,
                });

                if (response.data?.message) {
                    toast.success(response.data.message);
                    queryClient.invalidateQueries({
                        queryKey: [QueryKey.WEB_AUTHN],
                    })
                }

            } catch (e) {
                if (e instanceof Error) {
                    if (e.message.includes('timed out')) {
                        setError('Registration cancelled or timeout.')
                    } else {
                        setError(e.message)
                    }
                };
                setError('Something went wrong');
            } finally {
                setIsPending(false);
            }

        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('Failed to register passkey');
            }
        }
    }

    return (
        <section className="flex flex-col items-end">
            <Button
                variant={'outline'}
                size={'sm'}
                type="button"
                onClick={handleAddPassKey}
                disabled={isPending}
            >
                <Plus /> Add a Passkey
            </Button>

            {
                error && (
                    <p className="text-sm text-destructive mt-1">{error}</p>
                )
            }
        </section>
    )
}