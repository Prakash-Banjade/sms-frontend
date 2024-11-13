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
    dormitoryRoomId?: string;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) & {
    defaultValues?: dormitoryRoomFormType;
}

const dormitoryRoomForm = z.object({
    name: z.string().min(1, { message: 'Room name is required' }),
    roomNumber: z.coerce.number().int({ message: 'Room number must be an integer' }).min(1, { message: 'Room number must be at least 1' }),
    noOfBeds: z.coerce.number().int({ message: 'Number of beds must be an integer' }).positive({ message: 'Number of beds must be a positive number' }),
    costPerBed: z.coerce.number().min(1, { message: 'Cost per bed must be at least 1' }),
    description: z.string().max(200, { message: "Description is too long" }).nullish(),
    roomTypeId: z.string().uuid({ message: 'Room type ID must be a valid UUID' }),
    dormitoryId: z.string().uuid({ message: 'Dormitory ID must be a valid UUID' })
})

const defaultValues: Partial<dormitoryRoomFormType> = {
    roomNumber: undefined,
    noOfBeds: undefined,
    costPerBed: undefined,
    description: "",
    roomTypeId: undefined,
    dormitoryId: undefined
}

export type dormitoryRoomFormType = z.infer<typeof dormitoryRoomForm>;

export default function DormitoryRoomForm(props: Props) {
    const params = useParams();
    const id = (!!props.setIsOpen && props.dormitoryRoomId) ? props.dormitoryRoomId : params.id;

    const form = useForm<dormitoryRoomFormType>({
        resolver: zodResolver(dormitoryRoomForm),
        defaultValues: props?.defaultValues ?? defaultValues,
    })

    const { mutateAsync } = useAppMutation<Partial<dormitoryRoomFormType>, any>();

    async function onSubmit(values: dormitoryRoomFormType) {
        const method = ((!!props.setIsOpen && props.dormitoryRoomId) || params.id) ? "patch" : "post";

        const response = await mutateAsync({
            method,
            endpoint: QueryKey.DORMITORY_ROOMS,
            id,
            data: getDirtyValues(values, form),
            invalidateTags: [QueryKey.DORMITORY_ROOMS],
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
        <AppForm schema={dormitoryRoomForm} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <section className="grid 2xl:grid-cols-2 gap-8 grid-cols-1">
                    <AppForm.Text<dormitoryRoomFormType>
                        name="name"
                        label="Room Name"
                        placeholder={`e.g. Awesome Room`}
                        description="Enter the room name."
                        required
                        min={1}
                    />
                    <AppForm.Number<dormitoryRoomFormType>
                        name="roomNumber"
                        label="Room Number"
                        placeholder={`e.g. 123`}
                        description="Enter the room number."
                        required
                        min={1}
                    />
                    <AppForm.Number<dormitoryRoomFormType>
                        name="noOfBeds"
                        label="Number of beds"
                        placeholder={`e.g. 2`}
                        description="Enter the number of beds."
                        required
                        min={1}
                    />
                    <AppForm.Number<dormitoryRoomFormType>
                        name="costPerBed"
                        label="Cost per bed"
                        placeholder={`e.g. 100`}
                        description="Enter the cost per bed."
                        required
                        min={1}
                    />
                    <AppForm.DynamicSelect<dormitoryRoomFormType>
                        name="roomTypeId"
                        label="Room type"
                        placeholder="Select room type"
                        description="Select the type of the room."
                        fetchOptions={{
                            endpoint: QueryKey.ROOM_TYPES,
                            queryKey: [QueryKey.ROOM_TYPES],
                            queryString: 'page=1&take=50',
                        }}
                        labelKey={'name'}
                        required
                    />
                    <AppForm.DynamicSelect<dormitoryRoomFormType>
                        name="dormitoryId"
                        label="Dormitory"
                        placeholder="Select dormitory"
                        description="Select the dormitory."
                        fetchOptions={{
                            endpoint: QueryKey.DORMITORY,
                            queryKey: [QueryKey.DORMITORY],
                            queryString: 'page=1&take=50',
                        }}
                        labelKey={'name'}
                        required
                    />
                </section>

                <AppForm.Textarea<dormitoryRoomFormType>
                    containerClassName="grow"
                    name="description"
                    label="Description"
                    description="Describe the room or leave it blank."
                    placeholder="eg. This room type is for the students who are in the top tier of the school."
                />

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel action={onDialogClose}>Cancel</AppForm.Cancel>
                    <AppForm.Submit>
                        {
                            !!id ? "Save changes" : "Add dormitoryRoom"
                        }
                    </AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}