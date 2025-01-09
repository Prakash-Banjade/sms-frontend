import { Navigate, useNavigate, useParams } from "react-router-dom"
import { EmailVerificationForm } from "../components/confirm-email/email-verification-form";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { QueryKey } from "@/react-query/queryKeys";

export default function ConfirmEmailPage() {
    const { verificationToken } = useParams();
    const navigate = useNavigate();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: () => axios.post(`${import.meta.env.VITE_API_URL}/${QueryKey.AUTH_VERIFY_EMAIL_CONFIRM_TOKEN}`, { token: verificationToken }),
        onError: () => {
            navigate('/auth/login');
        },
    });

    // verify if the token is valid for now else redirect to login page
    useEffect(() => {
        mutateAsync();
    }, []);

    if (!verificationToken) return <Navigate to="/auth/login" />
    if (isPending) return <div>Loading...</div>

    return (
        <div className="lg:p-8 h-screen mx-auto flex flex-col justify-center space-y-6 w-[90%] max-w-[600px]">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Verify Email!
                </h1>
                <p className="text-sm text-muted-foreground">
                    Please enter the OTP sent to your email
                </p>
            </div>

            <EmailVerificationForm verificationToken={verificationToken} />
        </div>
    )
}