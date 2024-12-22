import AppForm from "@/components/forms/app-form"
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { getDirtyValues } from "@/utils/get-dirty-values";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"

type Props = {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & ({
    branchId: string;
    defaultValues: branchFormType;
} | {
    branchId?: undefined;
    defaultValues?: undefined;
})

const branchForm = z.object({
    name: z.string().min(2, { message: "Name is required" }),
    description: z.string().nullish(),
    address: z.string().max(50, { message: "Address is too long" }).nullish(),
})

const defaultValues: Partial<branchFormType> = {
    name: "",
    description: "",
    address: "",
}

export type branchFormType = z.infer<typeof branchForm>;

export default function BranchForm(props: Props) {
    const form = useForm<branchFormType>({
        resolver: zodResolver(branchForm),
        defaultValues: props?.defaultValues ?? defaultValues,
    })

    const { mutateAsync } = useAppMutation<Partial<branchFormType>, any>();

    async function onSubmit(values: branchFormType) {
        const response = await mutateAsync({
            method: props.branchId ? "patch" : "post",
            endpoint: QueryKey.BRANCHES,
            id: props.branchId,
            data: getDirtyValues(values, form),
            invalidateTags: [QueryKey.BRANCHES],
        });

        if (response?.data?.message) {
            onDialogClose();
        }
    }

    const onDialogClose = () => {
        form.reset();
        props.setIsOpen(false);
    }

    return (
        <AppForm schema={branchForm} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 @container">
                <section className="grid @xl:grid-cols-2 gap-8 grid-cols-1">
                    <AppForm.Text<branchFormType>
                        name="name"
                        label="Name"
                        placeholder={`e.g. Yogikuti Branch`}
                        description="Enter the name of the branch."
                        required
                    />
                    <AppForm.Text<branchFormType>
                        containerClassName="grow"
                        name="address"
                        label="Address"
                        description="Address of the branch."
                        placeholder="eg. Tilottama-9, Butwal"
                    />
                </section>
                <AppForm.Textarea<branchFormType>
                    containerClassName="grow"
                    name="description"
                    label="Description"
                    description="Describe the branch or leave it blank."
                    placeholder="eg. Yogikuti Branch is only for rich kids"
                />

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel action={onDialogClose}>Cancel</AppForm.Cancel>
                    <AppForm.Submit>
                        {
                            !!props.branchId ? "Save changes" : "Add branch"
                        }
                    </AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}