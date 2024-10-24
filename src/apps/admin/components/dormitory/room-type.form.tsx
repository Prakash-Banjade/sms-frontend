import AppForm from "@/components/forms/app-form"
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { getDirtyValues } from "@/utils/get-dirty-values";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod"

type Props = ({
    setIsOpen?: undefined;
} | {
    roomTypeId?: string;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) & {
    defaultValues?: roomTypeFormType;
}

const roomTypeForm = z.object({
    name: z.string().min(2, { message: "Name is required" }),
    description: z.string().nullish(),
})

const defaultValues: Partial<roomTypeFormType> = {
    name: "",
    description: "",
}

export type roomTypeFormType = z.infer<typeof roomTypeForm>;

export default function RoomTypeForm(props: Props) {
    const params = useParams();
    const id = (!!props.setIsOpen && props.roomTypeId) ? props.roomTypeId : params.id;

    const form = useForm<roomTypeFormType>({
        resolver: zodResolver(roomTypeForm),
        defaultValues: props?.defaultValues ?? defaultValues,
    })

    const { mutateAsync } = useAppMutation<Partial<roomTypeFormType>, any>();

    async function onSubmit(values: roomTypeFormType) {
        const method = ((!!props.setIsOpen && props.roomTypeId) || params.id) ? "patch" : "post";

        const response = await mutateAsync({
            method,
            endpoint: QueryKey.ROOM_TYPES,
            id,
            data: getDirtyValues(values, form),
            invalidateTags: [QueryKey.ROOM_TYPES],
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
        <AppForm schema={roomTypeForm} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <AppForm.Text<roomTypeFormType>
                    name="name"
                    label="Name"
                    placeholder={`e.g. Luxury room`}
                    description="Enter the name of the room type."
                    required
                />
                <AppForm.Textarea<roomTypeFormType>
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
                            !!id ? "Save changes" : "Add room type"
                        }
                    </AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}