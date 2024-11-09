import LoadingButton from "@/components/forms/loading-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { Check } from "lucide-react";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function ForgotPasswordForm() {
    const [responseMsg, setResponseMsg] = React.useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const { mutateAsync, isPending } = useAppMutation<{ email: string }, { message: string }>();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const email = new FormData(e.currentTarget).get('email') as string;

        if (!email) return;

        const response = await mutateAsync({
            method: "post",
            endpoint: QueryKey.AUTH_FORGOT_PASSWORD,
            data: {
                email,
            },
            toastOnSuccess: false,
        });

        if (response?.data?.message) {
            setResponseMsg(response?.data?.message);
        }

    };

    return (
        <>
            {
                responseMsg ? (
                    <div className="space-y-6 mt-6">
                        <p className="text-success font-semibold text-xl flex items-center justify-center gap-2">
                            <Check /> Check Your Email
                        </p>
                        <p className="text-muted-foreground">
                            We've sent a password reset link to your email address.
                            Please check your inbox and follow the instructions to reset your password.
                        </p>
                        <p>
                            {responseMsg}
                        </p>
                        <Button onClick={() => navigate('/')} className="w-full">
                            Return to Login
                        </Button>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-muted-foreground text-center mt-2">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                            <div className="space-y-2 text-left">
                                <Label htmlFor="email">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    defaultValue={location?.state?.email}
                                    placeholder="Enter your email address"
                                    required
                                />
                            </div>

                            <LoadingButton isLoading={isPending} loadingText="Sending..." type="submit" className="w-full">
                                Send Reset Link
                            </LoadingButton>
                        </form>

                        <p className="mt-6 text-center text-muted-foreground text-sm">
                            Remember your password?{' '}
                            <Link to="/auth/login" className="text-primary hover:underline" replace>
                                Log in
                            </Link>
                        </p>
                    </>
                )
            }
        </>
    );
}