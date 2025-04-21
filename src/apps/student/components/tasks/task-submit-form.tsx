import AppForm from "@/components/forms/app-form"
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { ETask, Role } from "@/types/global.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod"

const taskSubmissionSchema = z.object({
    taskId: z.string().uuid({ message: 'Task ID is required' }),
    note: z.string({ required_error: 'Note is required' }).max(200, { message: 'Note cannot be longer than 200 characters' }).optional(),
    attachmentIds: z.array(z.string().uuid()).max(5, { message: "Max 5 files" }),
}).refine(data => data.note || data.attachmentIds.length > 0, {
    message: 'Note or attachments are required',
    path: ['note']
})

type TaskSubmissionSChemaType = z.infer<typeof taskSubmissionSchema>;

export default function TaskSubmitForm({ type }: { type: ETask }) {
    const params = useParams();
    const navigate = useNavigate();

    const form = useForm<TaskSubmissionSChemaType>({
        defaultValues: {
            taskId: params.id!,
            note: '',
            attachmentIds: [],
        },
        resolver: zodResolver(taskSubmissionSchema)
    });

    const { mutateAsync } = useAppMutation();

    async function onSubmit(data: TaskSubmissionSChemaType) {
        const response = await mutateAsync({
            method: "post",
            endpoint: QueryKey.TASK_SUBMISSIONS,
            data,
            invalidateTags: [QueryKey.TASKS],
        });

        if (response.status === 201) {
            navigate(`/${Role.STUDENT}/tasks/${type}s?tab=submitted`);
        }
    }

    return (
        <AppForm schema={taskSubmissionSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 @container">
                <AppForm.FileUpload<TaskSubmissionSChemaType>
                    name="attachmentIds"
                    label="Attachments"
                    placeholder="Upload attachments"
                    description="Image, PDF | Max 5 files | 5 MB each"
                    multiple
                    maxLimit={5}
                    accept="image/png, image/jpeg, image/jpg, image/webp, application/pdf"
                />
                <AppForm.Textarea<TaskSubmissionSChemaType>
                    rows={8}
                    name="note"
                    label="Notes"
                    placeholder={`Any comments? (optional)`}
                />

                <section className="flex gap-4 justify-end @lg:flex-row flex-col">
                    <AppForm.Cancel className="w-full" action={() => navigate(`/${Role.STUDENT}/tasks/${type}s`)}>Cancel</AppForm.Cancel>
                    <AppForm.Submit className="w-full">Submit</AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}