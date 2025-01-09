import AppForm from "@/components/forms/app-form";
import { useAuth } from "@/contexts/auth-provider";
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { getDirtyValues } from "@/utils/get-dirty-values";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, differenceInDays, startOfDay } from "date-fns";
import { useForm } from "react-hook-form";
import { useNavigate, } from "react-router-dom";
import { z } from "zod";

const LeaveRequestSchema = z.object({
    leaveFrom: z.string({ required_error: "Leave from date is required" })
        .refine(val => !isNaN(Date.parse(val)), {
            message: 'Invalid leave from date'
        }),

    leaveTo: z.string({ required_error: "Leave to date is required" })
        .refine(val => !isNaN(Date.parse(val)), {
            message: 'Invalid leave to date'
        }),

    title: z
        .string()
        .min(1, { message: 'Title is required' }),

    description: z
        .string()
        .min(1, { message: 'Description is required' })
        .max(500, { message: 'Description must be less than 500 characters' }),

}).refine((data) => differenceInDays(startOfDay(new Date(data.leaveFrom)), startOfDay(new Date())) <= 7, {
    message: "Leave from date must be at least 7 days before leave to date",
    path: ["leaveFrom"],
}).refine((data) => new Date(data.leaveFrom) <= new Date(data.leaveTo), {
    message: "Leave from date cannot be greater than leave to date",
    path: ["leaveFrom"],
})

type leaveRequestSchemaType = z.infer<typeof LeaveRequestSchema>;

export default function LeaveRequestForm() {
    const navigate = useNavigate()
    const { payload } = useAuth();

    const form = useForm<leaveRequestSchemaType>({
        resolver: zodResolver(LeaveRequestSchema),
        defaultValues: {
            leaveFrom: "",
            leaveTo: "",
            title: "",
            description: ''
        }
    });

    const { mutateAsync } = useAppMutation<Partial<leaveRequestSchemaType>, any>();

    async function onSubmit(values: leaveRequestSchemaType) {
        const data = await mutateAsync({
            method: "post",
            endpoint: QueryKey.LEAVE_REQUESTS,
            data: getDirtyValues(values, form),
            invalidateTags: [QueryKey.LEAVE_REQUESTS],
        });

        if (data.data?.message) {
            form.reset();
            navigate(`/${payload?.role}/leave-requests`);
        }
    }

    return (
        <AppForm schema={LeaveRequestSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <AppForm.Text<leaveRequestSchemaType>
                    name="title"
                    label="Title"
                    placeholder="Enter leave title"
                    description="Provide a title for your leave request"
                    required
                />

                <AppForm.Textarea<leaveRequestSchemaType>
                    name="description"
                    label="Description"
                    placeholder="Enter description for your leave"
                    description="Provide a reason for the leave"
                    required
                />

                <section className="flex flex-wrap gap-8">
                    <AppForm.DatePicker<leaveRequestSchemaType>
                        containerClassName="grow"
                        name="leaveFrom"
                        label="Leave From"
                        description="From which date you  want leave"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        max={
                            !!form.watch('leaveTo')
                                ? new Date(form.watch('leaveTo')).toISOString().split("T")[0]
                                : addDays(new Date(), 7).toISOString().split("T")[0]
                        }
                    />
                    <AppForm.DatePicker<leaveRequestSchemaType>
                        containerClassName="grow"
                        name="leaveTo"
                        label="Leave To"
                        description="Till which date you want leave"
                        required
                        min={
                            !!form.watch('leaveFrom')
                                ? new Date(form.watch('leaveFrom')).toISOString().split("T")[0]
                                : new Date().toISOString().split("T")[0]
                        }
                        max={
                            !form.watch('leaveFrom')
                                ? addDays(new Date(), 7).toISOString().split("T")[0]
                                : undefined
                        }
                    />
                </section>

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel action={() => form.reset()}>Cancel</AppForm.Cancel>
                    <AppForm.Submit>
                        Apply Leave Request
                    </AppForm.Submit>
                </section>
            </form>
        </AppForm>
    );
}
