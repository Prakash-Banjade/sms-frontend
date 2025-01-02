import { Button } from "@/components/ui/button";
import { useAxios } from "@/services/api";
import { Plus } from "lucide-react";
import { startRegistration } from '@simplewebauthn/browser';
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddPassKeyBtn() {
    const axios = useAxios();
    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState<boolean>(false);

    const handleAddPassKey = async () => {
        setError(null);
        setIsPending(false);
        try {
            const response = await axios.post('/passkey/register');

            const challengePayload = response.data?.challengePayload;

            if (!challengePayload) return; // todo: show some error msg

            try {
                setIsPending(true);

                const registrationResponse = await startRegistration({ optionsJSON: challengePayload });

                const response = await axios.post('/passkey/verify-register', {
                    registrationResponse,
                });

                if (response.data?.message) {
                    toast.success(response.data.message);
                }

            } catch (e) {
                console.log(e)
                if (e instanceof Error) {
                    if (e.message.includes('timed out')) return setError('Registration cancelled or timeout.')
                    return setError(e.message)
                };
                setError('Something went wrong');
            } finally {
                setIsPending(false);
            }

        } catch (e) {
            if (e instanceof Error) return setError(e.message);
            setError('Failed to register passkey');
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