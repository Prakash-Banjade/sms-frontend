import AppForm from "@/components/forms/app-form"
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { getDirtyValues } from "@/utils/get-dirty-values";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"

type Props = ({
    chargeHeadId?: undefined;
    defaultValues?: undefined;
} | {
    chargeHeadId: string;
    defaultValues: chargeHeadSchemaType;
}) & {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const chargeHeadSchema = z.object({
    name: z.string().min(3, { message: "Name is required" }),
    description: z.string().max(200, { message: "Description is too long. Max 200 characters." }).nullish(),
    isMandatory: z.string().min(1, { message: "Is mandatory is required" }),
})

const defaultValues: Partial<chargeHeadSchemaType> = {
    name: "",
    description: "",
    isMandatory: "false",
}

export type chargeHeadSchemaType = z.infer<typeof chargeHeadSchema>;

export default function ChargeHeadFrom(props: Props) {
    const id = props.chargeHeadId;

    const form = useForm<chargeHeadSchemaType>({
        resolver: zodResolver(chargeHeadSchema),
        defaultValues: props?.defaultValues ?? defaultValues,
    })

    const { mutateAsync } = useAppMutation<Partial<Omit<chargeHeadSchemaType, "isMandatory">> & { isMandatory: boolean }, any>();

    async function onSubmit(values: chargeHeadSchemaType) {
        const response = await mutateAsync({
            method: id ? "patch" : "post",
            endpoint: QueryKey.CHARGE_HEADS,
            id,
            data: {
                ...getDirtyValues(values, form),
                isMandatory: String(values.isMandatory) === 'true',
            },
            invalidateTags: [QueryKey.CHARGE_HEADS],
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
        <AppForm schema={chargeHeadSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <AppForm.Text<chargeHeadSchemaType>
                    name="name"
                    label="Name"
                    placeholder={`e.g. Admission Fee`}
                    description="Enter the name of the charge head."
                    required
                />
                <AppForm.Textarea<chargeHeadSchemaType>
                    name="description"
                    label="Description"
                    placeholder={`e.g. Admission Fee for the new admission year.`}
                    description="Any additional information about the charge head."
                />

                {
                    (props.defaultValues?.isMandatory === 'false' || !props.defaultValues) && <div>
                        <AppForm.RadioGroup<chargeHeadSchemaType>
                            name="isMandatory"
                            label="Is Mandatory"
                            options={[
                                { label: "Yes", value: 'true' },
                                { label: "No", value: 'false' },
                            ]}
                        />
                        <p className="mt-2 text-sm bg-info/10 text-info p-2 rounded-md">Mandatory heads cannot be deleted.</p>
                    </div>
                }

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel action={onDialogClose}>Cancel</AppForm.Cancel>
                    <AppForm.Submit>
                        {
                            !!id ? "Save changes" : "Add Academic Year"
                        }
                    </AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}