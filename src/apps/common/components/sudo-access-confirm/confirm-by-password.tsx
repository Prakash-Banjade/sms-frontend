import AppForm from "@/components/forms/app-form";
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
    setIsVerified: React.Dispatch<React.SetStateAction<boolean>>;
}

const formSchema = z.object({
    sudo_password: z.string().min(1, {
        message: "Password is required",
    })
});

type TFormSchema = z.infer<typeof formSchema>;

export function ConfirmByPassword({ setIsVerified }: Props) {
    const form = useForm<TFormSchema>({
        defaultValues: { sudo_password: "" },
        resolver: zodResolver(formSchema),
    });

    const { mutateAsync } = useAppMutation<TFormSchema, { verified: boolean }>();

    async function onSubmit(values: TFormSchema) {
        const res = await mutateAsync({
            endpoint: QueryKey.AUTH_VERIFY_SUDO,
            method: 'post',
            data: values,
            toastOnError: false,
            toastOnSuccess: false,
        });

        if (res.data?.verified === true) {
            setIsVerified(true);
        } else {
            form.setError('sudo_password', { message: "Invalid password", type: 'manual' });
            form.setFocus('sudo_password');
        }
    }

    return (
        <AppForm form={form} schema={formSchema}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <AppForm.Password<TFormSchema>
                    name="sudo_password"
                    label="Password"
                    required
                    autoFocus
                    autoComplete="current-password webauthn"
                />

                <section className="mt-4">
                    <AppForm.Submit className="w-full">
                        Confirm
                    </AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}
