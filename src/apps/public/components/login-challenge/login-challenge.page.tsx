import { Separator } from "@/components/ui/separator";
import { getErrMsg } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CircleHelp, Inbox, KeyRound } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

export default function LoginChallengePage() {
    return (
        <div className="h-screen mx-auto flex flex-col justify-center space-y-6 w-[90%] max-w-[800px]">
            <div className="flex flex-col sm:text-center gap-1">
                <h1 className="sm:text-3xl text-2xl font-semibold tracking-tight">
                    2-Step Verification
                </h1>
                <p className="text-sm text-muted-foreground">
                    To help keep your account safe, Abhyam Academy wants to make sure it&apos;s really you trying to sign in
                </p>
                <TwoFAOptions />
            </div>
        </div>
    )
}

const emailSchema = z.string().email();

function TwoFAOptions() {
    const location = useLocation();
    const navigate = useNavigate();

    const { isPending: isSendOTPPending, mutateAsync: sendOTP } = useMutation({
        mutationFn: async (email: string) => axios.post(`${import.meta.env.VITE_API_URL}/auth/send-two-fa-otp`, { email }),
        onSuccess: (data) => {
            const { token, expiresIn } = data.data as { token: string, expiresIn: number };

            if (token) {
                navigate(token, { state: { time: Date.now(), expiresIn } }); // time is to keep track of timer
            }
        },
        onError: (err: any) => {
            toast.error(getErrMsg(err) ?? 'Failed to send OTP');
        }
    });

    useEffect(() => {
        const { success } = emailSchema.safeParse(location.state?.email);

        if (!success) navigate('/auth/login');
    }, [])

    const handleSendOTP = async () => {
        const email = location.state?.email;

        if (!email) return;

        await sendOTP(email);
    };

    return (
        <section className="mt-20">
            <h2 className="text-lg font-semibold mb-4 text-left">Choose how you want to sign in:</h2>

            <ul className="flex flex-col">
                <li>
                    <button
                        type="button"
                        className="rounded-lg w-full flex flex-col gap-2 hover:bg-secondary transition-all px-4 py-5 disabled:cursor-not-allowed disabled:opacity-80"
                        onClick={handleSendOTP}
                        disabled={isSendOTPPending}
                    >
                        <span className="flex items-center gap-4 font-medium">
                            <Inbox size={20} /> Send an OTP to your email
                        </span>
                        <span className="text-sm ml-10 text-left text-muted-foreground">
                            An OTP will be sent to your email. You will be prompted to enter that OTP.
                        </span>
                    </button>
                </li>
                <Separator className="my-1" />
                <li>
                    <button
                        type="button"
                        className="rounded-lg w-full flex flex-col gap-2 hover:bg-secondary transition-all px-4 py-5 disabled:cursor-not-allowed disabled:opacity-80"
                        disabled={isSendOTPPending}
                    >
                        <span className="flex items-center gap-4 font-medium">
                            <KeyRound size={20} /> Use a passkey
                        </span>
                        <span className="text-sm ml-10 text-left text-muted-foreground">
                            You have registered a passkey. You will be prompted to use it.
                        </span>
                    </button>
                </li>
                <Separator className="my-1" />
                <li>
                    <button
                        type="button"
                        className="rounded-lg w-full flex flex-col gap-2 hover:bg-secondary transition-all px-4 py-5 disabled:cursor-not-allowed disabled:opacity-80"
                        disabled={isSendOTPPending}
                    >
                        <span className="flex items-center gap-4 font-medium">
                            <CircleHelp size={20} /> Get help
                        </span>
                        <span className="text-sm ml-10 text-left text-muted-foreground">
                            For security reasons, this may take 3-5 business days
                        </span>
                    </button>
                </li>
            </ul>
        </section>
    )
}