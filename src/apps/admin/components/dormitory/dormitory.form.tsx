import AppForm from "@/components/forms/app-form"
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { EDormitoryType } from "@/types/global.type";
import { getDirtyValues } from "@/utils/get-dirty-values";
import { DormitoryTypeMappings } from "@/utils/labelToValueMappings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod"

type Props = ({
    setIsOpen?: undefined;
} | {
    dormitoryId?: string;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) & {
    defaultValues?: dormitoryFormType;
}

const dormitoryForm = z.object({
    name: z.string().min(2, { message: "Name is required" }),
    type: z.nativeEnum(EDormitoryType),
    description: z.string().nullish(),
    address: z.string().max(50, { message: "Address is too long" }).nullish(),
    intake: z.string().max(50, { message: "Intake is too long" }).nullish(),
})

const defaultValues: Partial<dormitoryFormType> = {
    name: "",
    description: "",
    address: "",
    intake: "",
    type: undefined,
}

export type dormitoryFormType = z.infer<typeof dormitoryForm>;

export default function DormitoryForm(props: Props) {
    const params = useParams();
    const id = (!!props.setIsOpen && props.dormitoryId) ? props.dormitoryId : params.id;

    const form = useForm<dormitoryFormType>({
        resolver: zodResolver(dormitoryForm),
        defaultValues: props?.defaultValues ?? defaultValues,
    })

    const { mutateAsync } = useAppMutation<Partial<dormitoryFormType>, any>();

    async function onSubmit(values: dormitoryFormType) {
        const method = ((!!props.setIsOpen && props.dormitoryId) || params.id) ? "patch" : "post";

        const response = await mutateAsync({
            method,
            endpoint: QueryKey.DORMITORY,
            id,
            data: getDirtyValues(values, form),
            invalidateTags: [QueryKey.DORMITORY],
        });

        if (response?.data?.message) {
            onDialogClose();
        }
    }

    const onDialogClose = () => {
        form.reset();
        props.setIsOpen && props.setIsOpen(false);
    }

    return (
        <AppForm schema={dormitoryForm} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 @container">
                <section className="grid @xl:grid-cols-2 gap-8 grid-cols-1">
                    <AppForm.Text<dormitoryFormType>
                        name="name"
                        label="Name"
                        placeholder={`e.g. Luxury room`}
                        description="Enter the name of the room type."
                        required
                    />
                    <AppForm.Select<dormitoryFormType>
                        name="type"
                        label="Type"
                        options={Object.entries(DormitoryTypeMappings).map(([key, value]) => ({ label: key, value: value }))}
                        description="Select the type of the dormitory."
                        required
                        placeholder="Select dormitory type"
                    />
                    <AppForm.Text<dormitoryFormType>
                        containerClassName="grow"
                        name="address"
                        label="Address"
                        description="Address of the dormitory."
                        placeholder="eg. Block No. 1, Block No. 2"
                    />
                    <AppForm.Text<dormitoryFormType>
                        containerClassName="grow"
                        name="intake"
                        label="Intake"
                        description="Intake of the dormitory."
                        placeholder="eg. Students can enter the dormitory by entering the intake number."
                    />
                </section>
                <AppForm.Textarea<dormitoryFormType>
                    containerClassName="grow"
                    name="description"
                    label="Description"
                    description="Describe the room type or leave it blank."
                    placeholder="eg. This room type is for the students who are in the top tier of the school."
                />

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel action={onDialogClose}>Cancel</AppForm.Cancel>
                    <AppForm.Submit>
                        {
                            !!id ? "Save changes" : "Add dormitory"
                        }
                    </AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}