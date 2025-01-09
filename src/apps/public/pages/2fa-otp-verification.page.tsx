import { useLocation } from "react-router-dom"
import { TwoFactorAuthOTPVerificationForm } from "../components/login-challenge/2fa-otp-verification-form";

export default function Confirm2FAOTPPage() {
    const location = useLocation();

    return (
        <div className="h-screen mx-auto flex flex-col justify-center space-y-12 w-[90%] max-w-[600px]">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="sm:text-3xl text-2xl font-semibold tracking-tight">
                    2-Step Verification
                </h1>
                <p className="text-sm text-muted-foreground">
                    Please enter the OTP sent to your email.&nbsp;
                    <span className="font-semibold">OTP will expire in {Math.ceil((location.state?.expiresIn ?? 0) / 60)} minutes</span>
                </p>
            </div>
            <TwoFactorAuthOTPVerificationForm />
        </div>
    )
}