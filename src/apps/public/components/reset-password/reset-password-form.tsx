import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AppForm from "@/components/forms/app-form";
import LoadingButton from "@/components/forms/loading-button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { QueryKey } from "@/react-query/queryKeys";

type Props = {
    token: string;
}

const resetPasswordSchema = z.object({
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

type TResetPasswordSchema = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordForm({ token }: Props) {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (data: { password: string, token: string }) => axios.post(`${import.meta.env.VITE_API_URL}/${QueryKey.AUTH_RESET_PASSWORD}`, data),
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.data?.message instanceof Object && 'message' in error.response.data.message) {
                    if (error.response.data.message.message?.includes('expired')) {
                        setError(error.response?.data.message?.message);
                    } else {
                        form.setError('password', { message: error.response.data.message.message });
                    }
                } else if (typeof error.response?.data?.message === 'string') {
                    form.setError('password', { message: error.response?.data?.message });
                } else {
                    form.setError('password', { message: error.message });
                }
            }
        },
        onSuccess(data) {
            if (data?.data?.message) {
                toast.success(data.data.message);
                navigate('/auth/login');
            }
        },
    })

    const form = useForm<TResetPasswordSchema>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit = async (values: TResetPasswordSchema) => {
        await mutateAsync({
            password: values.password,
            token,
        });
    }

    return (
        <AppForm schema={resetPasswordSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <AppForm.Password<TResetPasswordSchema>
                    label="New Password"
                    name="password"
                    placeholder="********"
                    description="Enter your new password"
                />
                <AppForm.Password<TResetPasswordSchema>
                    label="Confirm Password"
                    name="confirmPassword"
                    placeholder="********"
                    description="Re-enter your new password"
                />

                <LoadingButton isLoading={isPending} loadingText="Sending..." type="submit" className="w-full">
                    Reset Password
                </LoadingButton>

                <p className="text-destructive text-sm text-center min-h-4">{error || ''}</p>
            </form>
        </AppForm>
    )
}