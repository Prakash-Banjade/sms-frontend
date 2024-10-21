import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LoaderCircle } from "lucide-react"
import { Icons } from "@/components/ui/icons"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import AppForm from "@/components/forms/app-form"
interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> { }

const loginFormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string({ required_error: "Password is required" }).min(8, { message: "Password must be at least 8 characters long" }),
})

type loginFormSchemaType = z.infer<typeof loginFormSchema>;

export function LoginForm({ className, ...props }: LoginFormProps) {
    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    function onSubmit(values: z.infer<typeof loginFormSchema>) {
        console.log(values)
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <AppForm schema={loginFormSchema} form={form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <AppForm.Email<loginFormSchemaType>
                        label="Email"
                        name="email"
                        placeholder="name@example.com"
                    />
                    <AppForm.Password<loginFormSchemaType>
                        label="Password"
                        name="password"
                        placeholder="********"
                    />

                    <AppForm.Submit className="w-full">
                        Sign in
                    </AppForm.Submit>
                </form>
            </AppForm>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>
            <Button variant="outline" type="button" disabled={false}>
                {false ? (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Icons.gitHub className="mr-2 h-4 w-4" />
                )}{" "}
                GitHub
            </Button>
        </div>
    )
}