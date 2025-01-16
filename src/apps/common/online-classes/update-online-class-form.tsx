import AppForm from "@/components/forms/app-form";
import { useAppMutation } from "@/hooks/useAppMutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format, isBefore, isFuture, startOfDay } from "date-fns"
import { useForm } from "react-hook-form";
import { z } from "zod"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { QueryKey } from "@/react-query/queryKeys";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";

const updateOnlineClassSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long").max(100, "Title must be less than 100 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long").max(500, "Description must be less than 500 characters long").nullish(),
})

type TUpdateOnlineClassSchema = z.infer<typeof updateOnlineClassSchema>

type UpdateOnlineClassFormProps = {
    defaultValues: TUpdateOnlineClassSchema & { scheduleDate: string | undefined }
    id: string,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function UpdateOnlineClassForm({ defaultValues, id, setIsOpen }: UpdateOnlineClassFormProps) {
    const client = useStreamVideoClient();

    const form = useForm<TUpdateOnlineClassSchema>({
        resolver: zodResolver(updateOnlineClassSchema),
        defaultValues: {
            title: defaultValues.title,
            description: defaultValues.description,
        },
    });

    const { mutateAsync, isPending } = useAppMutation();

    async function onSubmit(values: TUpdateOnlineClassSchema) {
        await mutateAsync({
            endpoint: QueryKey.ONLINE_CLASSES,
            id,
            method: "patch",
            data: values,
            invalidateTags: [QueryKey.ONLINE_CLASSES],
        });

        setIsOpen(false);
    }

    async function onPostpone(values: TPostponeClassSchema) {
        if (!client) return;

        const { calls } = await client.queryCalls({
            filter_conditions: { id },
        });

        if (!calls.length) return;

        await mutateAsync({
            endpoint: QueryKey.ONLINE_CLASSES,
            id,
            method: "patch",
            data: {
                scheduleDate: values.scheduleDate + 'Z',
            },
            invalidateTags: [QueryKey.ONLINE_CLASSES],
        });

        const call = calls[0];

        await call.update({
            starts_at: new Date(values.scheduleDate).toISOString(),
        });

        setIsOpen(false);
    }

    return (
        <section className="space-y-6">
            <AppForm schema={updateOnlineClassSchema} form={form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 @container">
                    <AppForm.Text<TUpdateOnlineClassSchema>
                        name="title"
                        label="Title"
                        placeholder="Enter class title"
                        required
                        max={100}
                    />
                    <AppForm.Textarea<TUpdateOnlineClassSchema>
                        name="description"
                        label="Description"
                        placeholder="Enter class description"
                    />

                    <div className="flex justify-end">
                        <AppForm.Submit disabled={isPending}>Save Changes</AppForm.Submit>
                    </div>
                </form>
            </AppForm>

            {
                !!defaultValues.scheduleDate && (
                    <PostponeClassForm
                        defaultValues={{ scheduleDate: defaultValues.scheduleDate }}
                        id={id}
                        setIsOpen={setIsOpen}
                        onPostpone={onPostpone}
                        isPending={isPending}
                    />
                )
            }
        </section>
    )
}


/**
 * Postpone class from to update schedule date separately
 */

const postponeClassSchema = z.object({
    scheduleDate: z.string({ required_error: "Please select a date" }).refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date',
    }).refine((val) => (isFuture(val) && isBefore(val, startOfDay(addDays(new Date(), 3)))), {
        message: "Schedule date must be a future date less than 3 days from now",
        path: ["scheduleDate"],
    })
});

type TPostponeClassSchema = z.infer<typeof postponeClassSchema>

type PostponeClassFormProps = {
    defaultValues: TPostponeClassSchema
    id: string,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    onPostpone: (data: TPostponeClassSchema) => void,
    isPending: boolean
}

function PostponeClassForm({ defaultValues, onPostpone, isPending }: PostponeClassFormProps) {

    const form = useForm<TPostponeClassSchema>({
        resolver: zodResolver(postponeClassSchema),
        defaultValues,
    });

    return (
        <section>
            <h2 className="text-lg font-semibold mb-2">Postpone Class</h2>
            <AppForm schema={postponeClassSchema} form={form}>
                <form onSubmit={form.handleSubmit(onPostpone)} className="space-y-5 @container">
                    <FormField
                        control={form.control}
                        name="scheduleDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Schedule Date</FormLabel>
                                <FormControl>
                                    <Input
                                        type="datetime-local"
                                        {...field}
                                        value={field.value ?? ""}
                                        min={format(new Date(), "yyyy-MM-dd HH:mm").split(" ").join("T")}
                                        max={addDays(new Date(), 2).toISOString().split("T")[0] + "T23:59"}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end">
                        <AppForm.Submit disabled={isPending}>Postpone</AppForm.Submit>
                    </div>
                </form>
            </AppForm>
        </section>
    )
}