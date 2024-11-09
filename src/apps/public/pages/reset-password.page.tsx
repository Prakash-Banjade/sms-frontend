import { Navigate, useNavigate, useParams } from "react-router-dom";
import AuthSideView from "../components/auth-side-view";
import ResetPasswordForm from "../components/reset-password/reset-password-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

export default function ResetPasswordPage() {
    const params = useParams();
    const navigate = useNavigate();

    const token = params.token;

    const { mutateAsync, isPending } = useMutation({
        mutationFn: () => axios.post(`${import.meta.env.VITE_API_URL}/auth/verify-token`, { token }),
        onError: () => {
            navigate('/auth/login');
        },
    });

    // verify if the token is valid for now else redirect to login page
    useEffect(() => {
        mutateAsync();
    }, []);

    if (!token) return <Navigate to="/auth/login" />;
    if (isPending) return <div>Loading...</div>;

    return (
        <div className="relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 min-w-full">
            <AuthSideView />
            <div className="lg:p-8 h-screen mx-auto flex flex-col justify-center space-y-6 w-[90%] max-w-[600px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Reset Password
                    </h1>
                    <p className="text-muted-foreground">
                        Please enter your new password and confirm it.
                    </p>
                </div>
                <ResetPasswordForm token={token} />
            </div>
        </div>
    )
}