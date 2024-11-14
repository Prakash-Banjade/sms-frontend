import AppForm from "@/components/forms/app-form";
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { getDirtyValues } from "@/utils/get-dirty-values";
import { zodResolver } from "@hookform/resolvers/zod";;
import { leaveRequestDefaultValues, LeaveRequestSchema, leaveRequestSchemaType } from "../../schemas/leave-request.schema";
import { useForm } from "react-hook-form";
import { useNavigate, } from "react-router-dom";

export default function LeaveRequestForm() {
    const navigate = useNavigate()
    const form = useForm<leaveRequestSchemaType>({
        resolver: zodResolver(LeaveRequestSchema),
        defaultValues: leaveRequestDefaultValues
    });

    const { mutateAsync } = useAppMutation<Partial<leaveRequestSchemaType>, any>();

    async function onSubmit(values: leaveRequestSchemaType) {
        const method = "post"

        const response = await mutateAsync({
            method,
            endpoint: QueryKey.LEAVE_REQUESTS,
            data: getDirtyValues(values, form),
            invalidateTags: [QueryKey.LEAVE_REQUESTS],
        });

        if (response?.data?.message) {
            form.reset();
            navigate("confirm")
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
                    />
                    <AppForm.DatePicker<leaveRequestSchemaType>
                        containerClassName="grow"
                        name="leaveTo"
                        label="Leave To"
                        description="Till which date you want leave"
                        required
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
