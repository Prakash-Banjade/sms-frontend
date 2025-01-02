import AppForm from "@/components/forms/app-form";
import LoadingButton from "@/components/forms/loading-button";
import { NAME_REGEX, NAME_WITH_SPACE_REGEX } from "@/CONSTANTS"
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { Role } from "@/types/global.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod"

const adminFormSchema = z.object({
    firstName: z.string().min(1, { message: 'First name is required' }).regex(NAME_REGEX, { message: 'First name can only contain alphabets' }),
    lastName: z.string().min(1, { message: 'Last name is required' }).regex(NAME_WITH_SPACE_REGEX, { message: 'Seems like last name is invalid' }),
    email: z.string().email({ message: 'Invalid email address' }),
    branchId: z.string()
        .transform((val) => (val === '' ? undefined : val))
        .refine((val) => val === undefined || z.string().uuid().safeParse(val).success, {
            message: 'Invalid branch ID',
        })
        .nullish(),
});

type adminFormType = z.infer<typeof adminFormSchema>

export default function AdminForm() {
    const navigate = useNavigate();

    const form = useForm<adminFormType>({
        resolver: zodResolver(adminFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            branchId: '',
        }
    });

    const { mutateAsync, isPending } = useAppMutation<adminFormType, { message: string }>();

    async function onSubmit(values: adminFormType) {
        const response = await mutateAsync({
            endpoint: QueryKey.USERS,
            method: "post",
            data: values
        });

        if (response?.data?.message) {
            navigate(`/${Role.SUPER_ADMIN}/admins`);
        }
    }

    return (
        <AppForm schema={adminFormSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 @container">
                <section className="grid @xl:grid-cols-2 gap-8 grid-cols-1">
                    <AppForm.Text<adminFormType>
                        name="firstName"
                        label="First Name"
                        placeholder={`e.g. John`}
                        description="Enter the first name of admin."
                        required
                    />

                    <AppForm.Text<adminFormType>
                        name="lastName"
                        label="Last Name"
                        placeholder={`e.g. Doe`}
                        description="Enter the last name of admin."
                        required
                    />

                    <AppForm.Email<adminFormType>
                        name="email"
                        label="Email"
                        placeholder={`e.g. doejohn@example.com`}
                        description="Enter the email of admin."
                        required
                    />

                    <AppForm.DynamicSelect_V2<adminFormType>
                        name="branchId"
                        label="Branch"
                        description="Select the branch of admin."
                        placeholder="Select branch"
                        queryKey={QueryKey.BRANCHES}
                        disableOnNoOption
                        required
                    />
                </section>

                <section className="flex justify-end">
                    <LoadingButton
                        isLoading={isPending}
                        type="submit"
                    >
                        {isPending ? "Adding..." : "Add Admin"}
                    </LoadingButton>
                </section>
            </form>
        </AppForm >
    )
}