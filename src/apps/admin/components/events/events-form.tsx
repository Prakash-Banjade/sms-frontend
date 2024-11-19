import AppForm from "@/components/forms/app-form"
import { Button } from "@/components/ui/button";
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog";
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { getDirtyValues } from "@/utils/get-dirty-values";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = ({
    eventId?: undefined;
    defaultValues?: undefined;
} | {
    eventId?: string;
    defaultValues: Partial<eventSchemaType>;
}) & {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const eventSchema = z.object({
    title: z.string({ required_error: 'Title is required' })
        .min(1, { message: "Title is required" }),
    description: z.string().nullish(),
    dateFrom: z.string({ required_error: 'Date from is required' }).refine(val => !isNaN(Date.parse(val))),
    dateTo: z.string({ required_error: 'Date to is required' }).refine(val => !isNaN(Date.parse(val))),
    eventLocation: z.string(),
    members: z.array(z.string()).nullish(),
}).superRefine((data, ctx) => {
    if (new Date(data.dateFrom) > new Date(data.dateTo)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Date from must be before date to",
            path: ["dateFrom"],
        });
    }
});

export type eventSchemaType = z.infer<typeof eventSchema>;

export const eventFormDefaultValues: Partial<eventSchemaType> = {
    title: '',
    description: '',
    dateFrom: '',
    dateTo: '',
    eventLocation: '',
    members: [],
}

export default function EventForm(props: Props) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const id = props.eventId;

    const form = useForm<eventSchemaType>({
        resolver: zodResolver(eventSchema),
        defaultValues: props?.defaultValues ?? eventFormDefaultValues,
    })

    const { mutateAsync } = useAppMutation<Partial<eventSchemaType>, any>();
    const { mutateAsync: deleteMutateAsync, isPending: isDeletePending } = useAppMutation<void, { message: string }>();

    async function onSubmit(values: eventSchemaType) {
        const response = await mutateAsync({
            method: props.eventId ? "patch" : "post",
            endpoint: QueryKey.EVENTS,
            id,
            data: {
                ...getDirtyValues(values, form),
                dateFrom: new Date(values.dateFrom).toISOString(),
                dateTo: new Date(values.dateTo).toISOString(),
            },
            invalidateTags: [QueryKey.EVENTS],
        });

        if (response?.data?.message) {
            onDialogClose();
        }
    }

    async function handleDelete() {
        const response = await deleteMutateAsync({
            endpoint: QueryKey.EVENTS,
            method: "delete",
            id,
            invalidateTags: [QueryKey.EVENTS],
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
        <AppForm schema={eventSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <section className="grid lg:grid-cols-2 gap-8 grid-cols-1">
                    <AppForm.Text<eventSchemaType>
                        name="title"
                        label="Event title"
                        placeholder="eg. Parents Meeting"
                        description="Enter the title for event"
                        required
                    />

                    <AppForm.Text<eventSchemaType>
                        name="eventLocation"
                        label="Event Location"
                        placeholder="eg. Main Hall"
                        description="Enter the location of the event"
                    />

                    <AppForm.MultiSelect
                        label="Members"
                        name="members"
                        placeholder="Select members"
                        description="Select the members"
                        options={[
                            { value: 'all', label: 'All' },
                            { value: 'admins', label: 'Admins' },
                            { value: 'students', label: 'Students' },
                            { value: 'teachers', label: 'Teachers' },
                            { value: 'staffs', label: 'Staffs' },
                            { value: 'guardians', label: 'Guardians' },
                        ]}
                    />

                </section>


                <AppForm.Textarea<eventSchemaType>
                    rows={3}
                    name="description"
                    label="Description"
                    placeholder="eg. Describe about the event"
                    description="Any description for the event?"
                />

                <section className="flex gap-4">
                    {
                        !!id && <Button variant={'destructive'} type="button" onClick={() => setIsDeleteOpen(true)}>
                            <Trash />
                            Delete
                        </Button>
                    }
                    <div className="flex gap-4 ml-auto">
                        <AppForm.Cancel action={onDialogClose}>Cancel</AppForm.Cancel>
                        <AppForm.Submit>
                            {
                                !!id ? "Save changes" : "Add event"
                            }
                        </AppForm.Submit>
                    </div>
                </section>
            </form>

            <ResponsiveAlertDialog
                isOpen={isDeleteOpen}
                setIsOpen={setIsDeleteOpen}
                title="Delete Event"
                description="Are you sure you want to delete this event?"
                action={() => handleDelete()}
                actionLabel="Yes, Delete"
                isLoading={isDeletePending}
            />
        </AppForm>
    )
}