import { Navigate, useLocation } from "react-router-dom"
import { TwoFactorAuthOTPVerificationForm } from "../components/login-challenge/2fa-otp-verification-form";
import { z } from "zod";

const locationSchema = z.object({
    expiresIn: z.number().positive(),
});

export default function Confirm2FAOTPPage() {
    const location = useLocation();

    const { success, data } = locationSchema.safeParse(location.state);

    if (!success) return <Navigate to="/auth/login" />;

    return (
        <div className="h-screen mx-auto flex flex-col justify-center space-y-12 w-[90%] max-w-[600px]">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="sm:text-3xl text-2xl font-semibold tracking-tight">
                    2-Step Verification
                </h1>
                <p className="text-sm text-muted-foreground">
                    Please enter the OTP sent to your email.&nbsp;
                    <span className="font-semibold">OTP will expire in {Math.ceil((data.expiresIn ?? 0) / 60)} minutes</span>
                </p>
            </div>
            <TwoFactorAuthOTPVerificationForm />
        </div>
    )
}