import * as React from "react"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import AppForm from "@/components/forms/app-form"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAppMutation } from "@/hooks/useAppMutation"
import { QueryKey } from "@/react-query/queryKeys"
import { TAuthPayload, TCurrentUser, useAuth } from "@/contexts/auth-provider"
import { jwtDecode } from "jwt-decode"
import RememberMe from "./remember-me"
import { EMAIL_REGEX } from "@/CONSTANTS"
import toast from "react-hot-toast"

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {
    setIsFormSubmitting: React.Dispatch<React.SetStateAction<boolean>>
}

const loginFormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string({ required_error: "Password is required" }).min(8, { message: "Password must be at least 8 characters long" }),
})

export type loginFormSchemaType = z.infer<typeof loginFormSchema>;

export function LoginForm({ className, setIsFormSubmitting, ...props }: LoginFormProps) {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const form = useForm<loginFormSchemaType>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const { mutateAsync } = useAppMutation<loginFormSchemaType, { access_token: string, user: TCurrentUser } | { message: string }>();

    async function onSubmit(values: loginFormSchemaType) {
        const response = await mutateAsync({
            method: "post",
            endpoint: QueryKey.AUTH_LOGIN,
            data: values,
            toastOnSuccess: false,
        });

        if (!response.data) return;

        if ('access_token' in response.data) {
            setAuth({
                accessToken: response.data.access_token,
                user: response.data.user,
            });
            const payload: TAuthPayload = jwtDecode(response.data.access_token);

            navigate(location.state?.from?.pathname || `/${payload.role}/dashboard`, { replace: true });
        }

        if ('message' in response.data) {
            toast(response.data.message);
            form.reset();
        }
    };

    React.useEffect(() => {
        setIsFormSubmitting(form.formState.isSubmitting);
    }, [form.formState.isSubmitting]);

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <AppForm schema={loginFormSchema} form={form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <AppForm.Email<loginFormSchemaType>
                        label="Email"
                        name="email"
                        placeholder="name@example.com"
                        autoComplete="webauthn"
                        autoFocus
                    />
                    <section>
                        <AppForm.Password<loginFormSchemaType>
                            label="Password"
                            name="password"
                            placeholder="********"
                        />
                        <p className="text-sm text-muted-foreground mt-2 text-right">
                            <Link
                                to="/auth/forgot-password"
                                className="hover:underline"
                                state={{
                                    email: EMAIL_REGEX.test(form.getValues('email')) ? form.getValues('email') : ''
                                }}
                            >
                                Forgot password?
                            </Link>
                        </p>
                    </section>

                    <section className="space-y-3">
                        <RememberMe />
                        <AppForm.Submit className="w-full">
                            Sign in
                        </AppForm.Submit>
                    </section>

                </form>
            </AppForm>
        </div>
    )
}