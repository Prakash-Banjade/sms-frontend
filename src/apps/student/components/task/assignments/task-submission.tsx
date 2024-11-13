
import { TaskSubmissionDefaultValues, TaskSubmissionSchema, TaskSubmissionSchemaType } from "@/apps/student/schemas/task-submission.schema";
import AppForm from "@/components/forms/app-form";
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { ETask, ETaskSubmissionStatus } from "@/types/global.type";
import { zodResolver } from "@hookform/resolvers/zod";
;

import { useForm } from "react-hook-form";
type Props = {
    type: ETask,
    id: string,
    status: ETaskSubmissionStatus,
    attachments: {
        id: string,
        url: string
    }[],
    content: string

}
export default function TaskSubmissionForm({ type, id, status, content, attachments }: Props) {
    const form = useForm<TaskSubmissionSchemaType>({
        resolver: zodResolver(TaskSubmissionSchema),
        defaultValues: status === ETaskSubmissionStatus.Submitted
            ? {
                content: content,
                attachmentIds: attachments.map(att => att.id)
            }
            : TaskSubmissionDefaultValues
    });


    const { mutateAsync } = useAppMutation<Partial<TaskSubmissionSchemaType>, any>();

    async function onSubmit(values: TaskSubmissionSchemaType) {
        const method = "post"
        const appendData = { ...values, taskId: id }
        const response = await mutateAsync({
            method,
            endpoint: QueryKey.TASK_SUBMISSIONS,
            data: appendData,
            invalidateTags: [QueryKey.TASK_SUBMISSIONS],
        });

        if (response?.data?.message) {
            form.reset()
        }
    }


    return (
        <AppForm schema={TaskSubmissionSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <AppForm.Textarea<TaskSubmissionSchemaType>
                    name="content"
                    label="Content"
                    placeholder="Enter content"
                    description={`Provide a  additional info about ${type}`}
                    required
                />
                <AppForm.FileUpload<TaskSubmissionSchemaType>
                    name="attachmentIds"
                    label="Attachments"
                    placeholder="Upload attachments"
                    description="Image, PDF | Max 5 files | 5 MB each"
                    multiple
                    maxLimit={5}
                    accept="image/png, image/jpeg, image/jpg, image/webp, application/pdf"
                />

                <section className="flex gap-4 justify-end">
                    {/* <AppForm.Cancel action={() => form.reset()}>Cancel</AppForm.Cancel> */}
                    <AppForm.Submit disabled={status === ETaskSubmissionStatus.Submitted ? true : false}>
                        {`Submit ${type}`}
                    </AppForm.Submit>
                </section>
            </form>
        </AppForm>
    );
}
