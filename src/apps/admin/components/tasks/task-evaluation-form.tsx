import AppForm from "@/components/forms/app-form"
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { getDirtyValues } from "@/utils/get-dirty-values";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"

type Props = {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    taskMarks: number,
    taskSubmissionId: string
    defaultValues?: taskEvaluationFormType & { id: string },
}

export const taskEvaluationSchema = z.object({
    score: z.coerce.number().positive({ message: "Score must be a positive number" }).optional(),
    feedback: z.string().min(1, { message: "Feedback is required" }).max(200, { message: "Feedback must be 200 characters or less" }),
})

export type taskEvaluationFormType = z.infer<typeof taskEvaluationSchema>;

const defaultValues: taskEvaluationFormType = {
    score: 0,
    feedback: "",
}

export default function TaskEvaluationForm(props: Props) {
    const form = useForm<taskEvaluationFormType>({
        resolver: zodResolver(taskEvaluationSchema),
        defaultValues: props?.defaultValues ?? defaultValues,
    })

    const { mutateAsync } = useAppMutation<Partial<taskEvaluationFormType> & { taskSubmissionId: string }, any>();

    async function onSubmit(values: taskEvaluationFormType) {
        const response = await mutateAsync({
            method: props.defaultValues ? "patch" : "post",
            endpoint: QueryKey.TASK_EVALUATIONS,
            id: props.defaultValues?.id,
            data: {
                ...getDirtyValues(values, form),
                taskSubmissionId: props.taskSubmissionId
            },
            invalidateTags: [QueryKey.TASK_SUBMISSIONS],
        });

        if (response?.data?.message) {
            form.reset(defaultValues);
            onDialogClose();
        }
    }

    const onDialogClose = () => {
        props.setIsOpen && props.setIsOpen(false);
    }

    return (
        <AppForm schema={taskEvaluationSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 @container">
                {
                    props.taskMarks > 0 && (
                        <AppForm.Number<taskEvaluationFormType>
                            name="score"
                            label="Score"
                            description={`Score out of ${props.taskMarks}.`}
                            required
                            placeholder="e.g. 10"
                            min={0}
                            max={props.taskMarks}
                            step={0.5}
                        />
                    )
                }
                <AppForm.Textarea<taskEvaluationFormType>
                    containerClassName="grow"
                    name="feedback"
                    label="Feedback"
                    description="Your feedback matters."
                    placeholder="e.g. Well done!"
                    required
                />

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel action={onDialogClose}>Cancel</AppForm.Cancel>
                    <AppForm.Submit>
                        {
                            !!props.defaultValues ? "Save changes" : "Submit"
                        }
                    </AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}