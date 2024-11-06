import AppForm from "@/components/forms/app-form"
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { EStaff, EVehicleType } from "@/types/global.type";
import { getDirtyValues } from "@/utils/get-dirty-values";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod"

type Props = ({
    setIsOpen?: undefined;
} | {
    vehicleId?: string;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) & {
    defaultValues?: vehicleFormType;
}

export const vehicleSchema = z.object({
    vehicleNumber: z
        .string()
        .min(1, { message: 'Vehicle number is required' }),

    vehicleModel: z
        .string()
        .min(1, { message: 'Vehicle model is required' }),

    type: z.nativeEnum(EVehicleType),

    capacity: z
        .coerce
        .number()
        .int({ message: 'Capacity must be an integer' })
        .min(1, { message: 'Capacity must be at least 1' })
        .max(100, { message: 'Capacity cannot exceed 100' }),

    yearMade: z
        .coerce
        .number()
        .int({ message: 'Year made must be an integer' })
        .min(1990, { message: 'Year made cannot be earlier than 1990' })
        .max(new Date().getFullYear(), { message: `Year made cannot be in the future` }),

    note: z
        .string()
        .max(200, { message: 'Note should not exceed 200 characters' })
        .nullish(),

    driverId: z.string()
        .transform((val) => (val === '' ? undefined : val))
        .refine((val) => val === undefined || z.string().uuid().safeParse(val).success, {
            message: 'Invalid driver',
        })
        .nullish(),
})

const defaultValues: Partial<vehicleFormType> = {
    capacity: undefined,
    yearMade: undefined,
    note: undefined,
    driverId: undefined,
    vehicleNumber: "",
    vehicleModel: "",
}

export type vehicleFormType = z.infer<typeof vehicleSchema>;

export default function VehicleForm(props: Props) {
    const params = useParams();
    const id = (!!props.setIsOpen && props.vehicleId) ? props.vehicleId : params.id;

    const form = useForm<vehicleFormType>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: props?.defaultValues ?? defaultValues,
    })

    const { mutateAsync } = useAppMutation<Partial<vehicleFormType>, any>();

    async function onSubmit(values: vehicleFormType) {
        const method = ((!!props.setIsOpen && props.vehicleId) || params.id) ? "patch" : "post";

        const response = await mutateAsync({
            method,
            endpoint: QueryKey.VEHICLES,
            id,
            data: {
                ...getDirtyValues(values, form),
                driverId: values.driverId ?? null,
            },
            invalidateTags: [QueryKey.VEHICLES],
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
        <AppForm schema={vehicleSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <AppForm.Text<vehicleFormType>
                    name="vehicleNumber"
                    label="Vehicle Number"
                    placeholder={`e.g. LU 1 KHA 2280`}
                    description="Enter the vehicle number."
                    required
                />
                <AppForm.Text<vehicleFormType>
                    name="vehicleModel"
                    label="Vehicle Model"
                    description="Enter the vehicle model."
                    required
                    placeholder="e.g. AKA339"
                />
                <AppForm.Select<vehicleFormType>
                    name="type"
                    label="Type"
                    description="Select the vehicle type."
                    placeholder="Select vehicle type"
                    options={Object.entries(EVehicleType).map(([key, value]) => ({ label: key, value }))}
                    required
                />
                <AppForm.Number<vehicleFormType>
                    name="capacity"
                    label="Capacity"
                    description="Enter the vehicle capacity."
                    placeholder="eg. 30"
                    required
                />
                <AppForm.Text<vehicleFormType>
                    name="yearMade"
                    label="Year Made"
                    description="Enter the year made."
                    placeholder="eg. 2020"
                    required
                />
                <AppForm.DynamicSelect<vehicleFormType>
                    name="driverId"
                    label="Driver"
                    placeholder="Select driver"
                    description="Select the driver of the vehicle. Can be assigned later."
                    fetchOptions={{
                        endpoint: QueryKey.STAFFS + '/' + QueryKey.OPTIONS,
                        queryKey: [QueryKey.STAFFS],
                        queryString: `type=${EStaff.DRIVER}`,
                    }}
                    disableOnNoOption
                />
                <AppForm.Textarea<vehicleFormType>
                    containerClassName="grow"
                    name="note"
                    label="Note"
                    description="Any additional notes or comments."
                    placeholder="eg. The vehicle is in good condition."
                />

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel action={onDialogClose}>Cancel</AppForm.Cancel>
                    <AppForm.Submit>
                        {
                            !!id ? "Save changes" : "Add vehicle"
                        }
                    </AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}