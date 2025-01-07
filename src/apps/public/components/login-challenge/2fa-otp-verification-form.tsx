import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import LoadingButton from "@/components/forms/loading-button"
import axios, { AxiosError } from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useEffect } from "react"
import { TAuthPayload, TCurrentUser, useAuth } from "@/contexts/auth-provider"
import { jwtDecode } from "jwt-decode"

const FormSchema = z.object({
    otp: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    }),
    verificationToken: z.string().min(1),
});

const timeSchema = z.number().refine((val) => !isNaN(Date.parse(new Date(val).toISOString())));

type FormValues = z.infer<typeof FormSchema>

export function TwoFactorAuthOTPVerificationForm({ verificationToken }: { verificationToken: string }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { setAuth } = useAuth();

    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            otp: "",
            verificationToken,
        },
    });

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (data: FormValues) => axios.post(`${import.meta.env.VITE_API_URL}/auth/verify-two-fa-otp`, data),
        onError: (error) => {
            if (error instanceof AxiosError) {
                const errorMsg = error.response?.data?.message;

                if ('error' in errorMsg && errorMsg.error === 'TokenExpiredError') {
                    toast.error('OTP has expired. Please request a new one.');
                    navigate('/auth/login')
                }

                if (typeof errorMsg === 'string') {
                    toast.error(errorMsg);
                    navigate('/auth/login')
                }
            }
        },
        onSuccess(res) { // after successful handle, login the user
            const response = res.data as { access_token: string, user: TCurrentUser };

            if ('access_token' in response) {
                setAuth({
                    accessToken: response.access_token,
                    user: response.user,
                });
                const payload: TAuthPayload = jwtDecode(response.access_token);

                navigate(`/${payload.role}/dashboard`, { replace: true });
            } else {
                toast.error(res.data.message);
            }
        }
    })

    // check if location.state has valid time or not
    useEffect(() => {
        const time = location.state?.time;

        const { success } = timeSchema.safeParse(time);

        if (!success) navigate('/auth/login');
    }, [])

    function onSubmit(data: FormValues) {
        mutateAsync(data);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center justify-center gap-6">
                <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                        <FormItem className="flex flex-col items-center">
                            <FormControl>
                                <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} {...field}>
                                    <InputOTPGroup>
                                        <InputOTPSlot className="size-12" index={0} />
                                        <InputOTPSlot className="size-12" index={1} />
                                        <InputOTPSlot className="size-12" index={2} />
                                        <InputOTPSlot className="size-12" index={3} />
                                        <InputOTPSlot className="size-12" index={4} />
                                        <InputOTPSlot className="size-12" index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </FormControl>
                            <FormDescription>
                                Please enter the one-time password sent to your email.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <LoadingButton
                    isLoading={isPending}
                    type="submit"
                    loadingText="Verifying..."
                >
                    Submit
                </LoadingButton>
            </form>
        </Form>
    )
}
