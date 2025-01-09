import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import LoadingButton from "@/components/forms/loading-button"
import { QueryKey } from "@/react-query/queryKeys"
import axios, { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"

const FormSchema = z.object({
    otp: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    }),
    verificationToken: z.string().min(1),
})

type FormValues = z.infer<typeof FormSchema>

export function EmailVerificationForm({ verificationToken }: { verificationToken: string }) {
    const navigate = useNavigate();

    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            otp: "",
            verificationToken,
        },
    });

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (data: FormValues) => axios.post(`${import.meta.env.VITE_API_URL}/${QueryKey.AUTH_VERIFY_EMAIL}`, data),
        onError: (error) => {
            if (error instanceof AxiosError) {
                const errorMsg = error.response?.data?.message;

                if ('error' in errorMsg && errorMsg.error === 'TokenExpiredError') {
                    toast.error('Your verification token has expired. Please request a new one.');
                    navigate('/auth/login')
                }

                if (typeof errorMsg === 'string') {
                    toast.error(errorMsg);
                    navigate('/auth/login')
                }
            }
        },
        onSuccess() {
            toast.success('Your email has been verified successfully. Login credentials have been sent to your email.');
            navigate('/auth/login')
        }
    })

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
                    Verify
                </LoadingButton>
            </form>
        </Form>
    )
}
