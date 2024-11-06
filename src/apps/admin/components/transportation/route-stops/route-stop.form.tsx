import AppForm from "@/components/forms/app-form"
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { getDirtyValues } from "@/utils/get-dirty-values";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod"

type Props = {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & ({
    routeStopId: string;
    defaultValues: routeFormType;
} | {
    routeStopId?: undefined;
    defaultValues?: undefined;
})

export const routeStopSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Name is required' }),

    location: z
        .string()
        .min(1, { message: 'Location is required' }),

    fare: z
        .coerce
        .number()
        .refine(val => val > 0, { message: 'Fare must be greater than 0' }),

    sequence: z
        .coerce
        .number()
        .int({ message: 'Sequence must be an integer' })
        .refine(val => val > 0, { message: 'Sequence must be greater than 0' }),

    distance: z
        .coerce
        .number()
        .refine(val => val > 0, { message: 'Distance must be greater than 0' }),

    pickUpTime: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Invalid pick up time. Required format: HH:MM' }),

    dropOffTime: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Invalid drop off time. Required format: HH:MM' }),

    vehicleId: z
        .string()
        .uuid({ message: 'Invalid route ID format' }),
});

const defaultValues: Partial<routeFormType> = {
    dropOffTime: undefined,
    fare: undefined,
    location: "",
    name: "",
    pickUpTime: undefined,
    sequence: undefined,
    vehicleId: undefined,
}

export type routeFormType = z.infer<typeof routeStopSchema>;

export default function RouteStopForm(props: Props) {
    const params = useParams();

    const form = useForm<routeFormType>({
        resolver: zodResolver(routeStopSchema),
        defaultValues: props?.defaultValues ?? defaultValues,
    })

    const { mutateAsync } = useAppMutation<Partial<routeFormType>, any>();

    async function onSubmit(values: routeFormType) {
        const method = ((!!props.setIsOpen && props.routeStopId) || params.id) ? "patch" : "post";

        const response = await mutateAsync({
            method,
            endpoint: QueryKey.ROUTE_STOPS,
            id: props.routeStopId,
            data: getDirtyValues(values, form),
            invalidateTags: [QueryKey.ROUTE_STOPS],
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
        <AppForm schema={routeStopSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 @container">
                <section className="grid @2xl:grid-cols-2 grid-cols-1 gap-5">
                    <AppForm.Text<routeFormType>
                        name="name"
                        label="Stop Name"
                        description="Enter the route stop name."
                        required
                        placeholder="e.g. Milan Chowk"
                    />
                    <AppForm.Number<routeFormType>
                        name="sequence"
                        label="Sequence"
                        placeholder={`e.g. 1`}
                        description="Enter the route sequence."
                        required
                        min={1}
                    />
                    <AppForm.Text<routeFormType>
                        name="location"
                        label="Location"
                        description="Enter the route location."
                        required
                        placeholder="e.g. Milan Chowk"
                    />
                    <AppForm.TimePicker<routeFormType>
                        name="pickUpTime"
                        label="Pick Up Time"
                        description="Select the route pick up time."
                        placeholder="Select pick up time"
                        required
                    />
                    <AppForm.TimePicker<routeFormType>
                        name="dropOffTime"
                        label="Drop Off Time"
                        description="Enter the route drop off time."
                        placeholder="eg. 30"
                        required
                    />
                    <AppForm.Number<routeFormType>
                        name="distance"
                        label="Distance (Km)"
                        description="Enter the route distance."
                        placeholder="eg. 15"
                        required
                        min={1}
                    />
                    <AppForm.Number<routeFormType>
                        name="fare"
                        label="Fare"
                        description="Enter the route fare."
                        placeholder="eg. 100"
                        required
                        min={1}
                    />
                    <AppForm.DynamicCombobox<routeFormType>
                        name='vehicleId'
                        label='Vehicle'
                        placeholder='Select vehicle'
                        description='Select a vehicle from the list'
                        queryKey={QueryKey.VEHICLES}
                        required
                    />
                </section>

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel action={onDialogClose}>Cancel</AppForm.Cancel>
                    <AppForm.Submit>
                        {
                            !!props.routeStopId ? "Save changes" : "Add stop"
                        }
                    </AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}