import AppForm from "@/components/forms/app-form";
import { useAuth } from "@/contexts/auth-provider";
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const changePasswordSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
    logout: z.boolean(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

type TChangePasswordSchema = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordForm() {
    const { setAuth } = useAuth();

    const form = useForm({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            logout: false
        },
        mode: 'onChange'
    });

    const { mutateAsync, error } = useAppMutation();

    async function onSubmit(values: TChangePasswordSchema) {
        await mutateAsync({
            endpoint: QueryKey.AUTH_CHANGE_PASSWORD,
            method: 'post',
            data: values,
            toastOnError: false,
        })

        form.reset();

        if (values.logout) { setAuth(null); }
    };

    useEffect(() => { // show error directly in form field if send by server
        const errObj = (error as any)?.response?.data?.message;
        if (!!errObj?.field) {
            form.setError(errObj.field, { message: errObj?.message });
            form.setFocus(errObj.field);
        }
    }, [error])

    return (
        <AppForm form={form} schema={changePasswordSchema}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <AppForm.Password<TChangePasswordSchema>
                    name="currentPassword"
                    label="Current Password"
                    required
                    placeholder="********"
                />

                <AppForm.Password<TChangePasswordSchema>
                    name="newPassword"
                    label="New Password"
                    required
                    placeholder="********"
                />

                <AppForm.Password<TChangePasswordSchema>
                    name="confirmPassword"
                    label="Confirm Password"
                    required
                    placeholder="********"
                />

                <AppForm.Checkbox<TChangePasswordSchema>
                    name="logout"
                    label="Logout of all devices"
                    description="If checked, the user will be logged out of all logged in devices."
                />

                <AppForm.Submit>
                    Change Password
                </AppForm.Submit>
            </form>
        </AppForm>

    )
}