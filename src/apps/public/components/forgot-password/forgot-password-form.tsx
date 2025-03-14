import LoadingButton from "@/components/forms/loading-button";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppMutation } from "@/hooks/useAppMutation";
import { useServerErrorInField } from "@/hooks/useServerErrorInField";
import { QueryKey } from "@/react-query/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
    email: z.string().email(),
});

export default function ForgotPasswordForm() {
    const [responseMsg, setResponseMsg] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: location?.state?.email ?? "",
        }
    })

    const { mutateAsync, isPending, error } = useAppMutation<{ email: string }, { message: string }>();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const response = await mutateAsync({
            method: "post",
            endpoint: QueryKey.AUTH_FORGOT_PASSWORD,
            data: values,
            toastOnSuccess: false,
        });

        if (response?.data?.message) {
            setResponseMsg(response?.data?.message);
        }
    };

    // show error directly in form field if send by server
    useServerErrorInField(error, form);

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
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="text-left">
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="Enter your email address" required {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <LoadingButton isLoading={isPending} loadingText="Sending..." type="submit" className="w-full">
                                    Send Reset Link
                                </LoadingButton>
                            </form>
                        </Form>

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