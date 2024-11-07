import AppForm from "@/components/forms/app-form"
import { ClassSectionFormField } from "@/components/forms/class-section-form-field";
import { useAuth } from "@/contexts/auth-provider";
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { ETask, IFileUploadResponse } from "@/types/global.type";
import { createQueryString } from "@/utils/create-query-string";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod"
import { useGetClassRoomsOptions } from "../class-rooms/actions";

type Props = ({
    taskId?: undefined;
    attachments?: undefined;
} | {
    taskId: string;
    defaultValues: taskSchemaType;
    type: ETask;
    attachments: IFileUploadResponse['files'];
}) & {
    taskType: ETask;
}

const taskSchema = z.object({
    title: z.string().min(3, { message: "Title is required" }),
    description: z.string({ required_error: "Description is required" }),
    deadline: z.string({ required_error: "Submission date is required" }).min(10, { message: "Submission date is required" }).transform((value) => new Date(value).toISOString()),
    classRoomId: z.string({ required_error: "Class room is required" })
        .uuid({ message: 'Select a class room' }),
    sectionIds: z.array(
        z.string({ required_error: "Section is required" })
            .uuid({ message: 'Select a section' })
    ).optional(),
    subjectId: z.string({ required_error: "Subject is required" })
        .uuid({ message: 'Select a subject' }),
    marks: z.coerce.number().min(0, { message: "Marks is required" }),
    taskType: z.nativeEnum(ETask),
    attachmentIds: z.array(z.string()).max(5, { message: "Max 5 files" }).optional(), // values can be URLs or UUIDs
})

const defaultValues: Partial<taskSchemaType> = {
    title: "",
    deadline: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    description: "",
    subjectId: undefined,
    classRoomId: undefined,
    sectionIds: [],
    attachmentIds: [],
    marks: 0,
}

export type taskSchemaType = z.infer<typeof taskSchema>;

export default function TaskForm(props: Props) {
    const navigate = useNavigate();
    const { payload } = useAuth();

    // fetching options outside to validate class room and sections
    const { data, isLoading } = useGetClassRoomsOptions({ queryString: 'page=1&take=50' });

    const form = useForm<taskSchemaType>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            ...(props.taskId ? props?.defaultValues : defaultValues),
            taskType: props.taskType,
        },
    })

    const { mutateAsync } = useAppMutation<Partial<Omit<taskSchemaType, 'sectionIds'> & { classRoomIds: string[] }>, any>();

    async function onSubmit(values: taskSchemaType) {
        // check if section is selected or not
        if (data?.data?.find(classRoom => classRoom.id === values.classRoomId)?.children?.length && !values.sectionIds?.length) {
            form.setError("sectionIds", { type: "required", message: "Section is required" });
            return;
        }

        const method = !!props.taskId ? "patch" : "post";

        const response = await mutateAsync({
            method,
            endpoint: QueryKey.TASKS,
            id: props.taskId,
            data: {
                ...values,
                classRoomIds: values.sectionIds?.length ? values.sectionIds : [values.classRoomId], // need to send as classRoomIds not section Ids
                attachmentIds: values.attachmentIds,
            },
            invalidateTags: [QueryKey.TASKS],
        });

        if (response?.data?.message) {
            navigate(`/${payload?.role}/tasks`);
        }
    }

    return (
        <AppForm schema={taskSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <section className="grid lg:grid-cols-2 gap-8 grid-cols-1">
                    <AppForm.Text<taskSchemaType>
                        name="title"
                        label="Title"
                        placeholder="eg. Complete the QnA of the day"
                        description={`Enter the title of the ${props.taskType}.`}
                        required
                    />

                    <ClassSectionFormField multipleSections options={data?.data ?? []} isLoading={isLoading} />

                    <AppForm.DynamicSelect<taskSchemaType>
                        name="subjectId"
                        label="Subject"
                        placeholder="Select subject"
                        description="Select the subject"
                        fetchOptions={{
                            endpoint: QueryKey.SUBJECTS + '/' + QueryKey.OPTIONS,
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
                        disableOnNoOption
                    />

                    <AppForm.DatePicker<taskSchemaType>
                        name="deadline"
                        label="Submission Date"
                        description={`Enter the submission date for ${props.taskType}.`}
                        required
                        min={new Date().toISOString().split('T')[0]}
                    />

                    <AppForm.Number<taskSchemaType>
                        name="marks"
                        label="Marks"
                        placeholder="eg. 100"
                        description="Enter the marks for task or leave it blank."
                    />
                    <AppForm.Textarea<taskSchemaType>
                        rows={8}
                        name="description"
                        label="Description"
                        placeholder={`eg. Write some details about ${props.taskType} here`}
                        required
                    />
                    <AppForm.FileUpload<taskSchemaType>
                        name="attachmentIds"
                        label="Attachments"
                        placeholder="Upload attachments"
                        description="Image, PDF | Max 5 files | 5 MB each"
                        multiple
                        maxLimit={5}
                        initialUpload={props.attachments ?? []}
                        accept="image/png, image/jpeg, image/jpg, image/webp, application/pdf"
                    />
                </section>


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