import AppForm from "@/components/forms/app-form"
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { getDirtyValues } from "@/utils/get-dirty-values";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"

type Props = {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    classRoomId: string;
}

const feeStructureSchema = z.object({
    chargeHeadId: z.string({ required_error: "Charge head is required" }).uuid({ message: "Invalid charge head id" }),
    classRoomId: z.string({ required_error: "Class room is required" }).uuid({ message: "Invalid class room id" }),
    amount: z.coerce.number().nonnegative({ message: 'Amount must be a positive number' }).refine(value => value >= 0, {
        message: 'Amount is required',
    }),
})

const defaultValues: Partial<feeStructureSchemaType> = {
    chargeHeadId: undefined,
    classRoomId: undefined,
    amount: undefined,
}

export type feeStructureSchemaType = z.infer<typeof feeStructureSchema>;

export default function FeeStructureFrom(props: Props) {
    const form = useForm<feeStructureSchemaType>({
        resolver: zodResolver(feeStructureSchema),
        defaultValues: {
            ...defaultValues,
            classRoomId: props.classRoomId,
        },
    })

    const { mutateAsync } = useAppMutation<Partial<feeStructureSchemaType>, any>();

    async function onSubmit(values: feeStructureSchemaType) {
        const response = await mutateAsync({
            method: "post",
            endpoint: QueryKey.FEE_STRUCTURES,
            data: {
                ...getDirtyValues(values, form),
                classRoomId: values.classRoomId
            },
            invalidateTags: [QueryKey.FEE_STRUCTURES],
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
        <AppForm schema={feeStructureSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <AppForm.DynamicCombobox<feeStructureSchemaType>
                    name="chargeHeadId"
                    label="Charge Head"
                    description="Select the charge head for this fee structure."
                    required
                    queryKey={QueryKey.CHARGE_HEADS}
                    queryString="defaults=false"
                    // endPoint={`${QueryKey.CHARGE_HEADS}/${QueryKey.OPTIONS}?classRoomId=${props.classRoomId}&onlyAvailable=true`}
                />

                <AppForm.Number<feeStructureSchemaType>
                    name="amount"
                    label="Amount"
                    placeholder={`e.g. 1000`}
                    description="Enter the amount for the charge head."
                    min={0}
                    required
                />

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel action={onDialogClose}>Cancel</AppForm.Cancel>
                    <AppForm.Submit>Save</AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}