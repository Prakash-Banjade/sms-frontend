import AppForm from "@/components/forms/app-form"
import { ClassSectionFormField } from "@/components/forms/class-section-form-field";
import { useAuth } from "@/contexts/auth-provider";
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { ETask } from "@/types/global.type";
import { createQueryString } from "@/utils/create-query-string";
import { getDirtyValues } from "@/utils/get-dirty-values";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod"

type Props = ({
    taskId?: undefined;
} | {
    taskId: string;
    defaultValues: taskSchemaType;
    type: ETask;
}) & {
    taskType: ETask;
}

const taskSchema = z.object({
    title: z.string().min(3, { message: "Title is required" }),
    description: z.string({ required_error: "Description is required" }),
    submissionDate: z.string({ required_error: "Submission date is required" }).min(10, { message: "Submission date is required" }).transform((value) => new Date(value).toISOString()),
    classRoomId: z.string({ required_error: "Class room is required" })
        .uuid({ message: 'Invalid class room ID. Must be a valid UUID' }),
    sectionIds: z.string({ required_error: "Section is required" })
        .uuid({ message: 'Invalid class section ID. Must be a valid UUID' })
        .optional(),
    subjectId: z.string({ required_error: "Subject is required" })
        .uuid({ message: 'Invalid subject ID. Must be a valid UUID' }),
    marks: z.coerce.number().min(0, { message: "Marks is required" }),
    taskType: z.nativeEnum(ETask),
})

const defaultValues: Partial<taskSchemaType> = {
    title: "",
    submissionDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    description: "",
    subjectId: undefined,
    classRoomId: undefined,
    marks: 0,
}

export type taskSchemaType = z.infer<typeof taskSchema>;

export default function TaskForm(props: Props) {
    const navigate = useNavigate();
    const { payload } = useAuth();

    const form = useForm<taskSchemaType>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            ...(props.taskId ? props?.defaultValues : defaultValues),
            taskType: props.taskType,
        },
    })

    const { mutateAsync } = useAppMutation<Partial<taskSchemaType>, any>();

    async function onSubmit(values: taskSchemaType) {
        const method = !!props.taskId ? "patch" : "post";

        const response = await mutateAsync({
            method,
            endpoint: QueryKey.TASKS,
            id: props.taskId,
            data: values,
            invalidateTags: [QueryKey.TASKS],
        });

        if (response?.data?.message) {
            navigate(`/${payload?.role}/academic-years`);
        }
    }

    return (
        <AppForm schema={taskSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <section className="grid lg:grid-cols-2 gap-8 grid-cols-1">
                    <AppForm.Text<taskSchemaType>
                        name="title"
                        label="Name"
                        placeholder="eg. Mathematics"
                        description={`Enter the title of the ${props.taskType}.`}
                        required
                    />
                    <AppForm.DatePicker<taskSchemaType>
                        name="submissionDate"
                        label="Submission Date"
                        description={`Enter the submission date for ${props.taskType}.`}
                        required
                        min={new Date().toISOString().split('T')[0]}
                    />

                    <ClassSectionFormField />

                    <AppForm.DynamicMultiSelect<taskSchemaType>
                        name="subjectId"
                        label="Subject"
                        placeholder="Select subject"
                        description="Select the subject"
                        fetchOptions={{
                            endpoint: QueryKey.SUBJECTS + '/options',
                            queryKey: [QueryKey.SUBJECTS, form.watch('classRoomId')],
                            queryString: createQueryString({
                                classRoomId: form.watch('classRoomId'),
                            }),
                            options: {
                                enabled: !!form.watch('classRoomId'),
                            }
                        }}
                        labelKey={'subjectName'}
                        disableOnNoOption
                        required
                    />
                    
                    {/* <AppForm.DynamicSelect<taskSchemaType>
                        name="subjectId"
                        label="Subject"
                        placeholder="Select subject"
                        description="Select the subject"
                        fetchOptions={{
                            endpoint: QueryKey.SUBJECTS + '/options',
                            queryKey: [QueryKey.SUBJECTS, form.watch('classRoomId')],
                            queryString: createQueryString({
                                classRoomId: form.watch('classRoomId'),
                            }),
                            options: {
                                enabled: !!form.watch('classRoomId'),
                            }
                        }}
                        labelKey={'subjectName'}
                        required
                    /> */}

                    <AppForm.Number<taskSchemaType>
                        name="marks"
                        label="Marks"
                        placeholder="eg. 100"
                        description="Enter the marks for task or leave it blank."
                    />
                </section>

                <AppForm.Textarea<taskSchemaType>
                    rows={8}
                    name="description"
                    label="Description"
                    placeholder={`eg. Write some details about ${props.taskType} here`}
                    required
                />

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel>Cancel</AppForm.Cancel>
                    <AppForm.Submit className="capitalize">
                        {
                            !!props.taskId ? "Save changes" : `Add ${props.taskType}`
                        }
                    </AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}