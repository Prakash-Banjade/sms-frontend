import AppForm from "@/components/forms/app-form"
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { subjectChapterFormDefaultValues, subjectChapterSchema, subjectChapterSchemaType } from "@/schemas/subject.schema";
import { ESubjectChapterPriority } from "@/types/global.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

type Props = {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    subjectChapterId?: string;
    defaultValues?: subjectChapterSchemaType;
}

export default function SubjectChapterForm(props: Props) {
    const params = useParams();
    const subjectId = params.id!; // this component is only used in the subject page

    const form = useForm<subjectChapterSchemaType>({
        resolver: zodResolver(subjectChapterSchema),
        defaultValues: props?.defaultValues ?? {
            ...subjectChapterFormDefaultValues,
            subjectId,
        },
    })

    const { mutateAsync } = useAppMutation<Partial<subjectChapterSchemaType>, any>();

    async function onSubmit(values: subjectChapterSchemaType) {
        const method = !!props.subjectChapterId ? "patch" : "post";

        const response = await mutateAsync({
            method,
            id: props.subjectChapterId,
            endpoint: QueryKey.SUBJECT_CHAPTERS,
            data: values,
            invalidateTags: [QueryKey.SUBJECT_CHAPTERS],
        });

        if (response?.data?.message) {
            onDialogClose();
        }
    }

    const onDialogClose = () => {
        form.reset();
        props.setIsOpen(false);
    }

    return (
        <AppForm schema={subjectChapterSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <section className="grid lg:grid-cols-2 gap-8 grid-cols-1">
                    <AppForm.Text<subjectChapterSchemaType>
                        name="title"
                        label="Chapter title"
                        placeholder="eg. Introduction"
                        description="Enter the chapter title"
                        required
                    />

                    <AppForm.Select<subjectChapterSchemaType>
                        name="priority"
                        label="Priority"
                        placeholder="Select priority"
                        description="Select the priority of the chapter"
                        required
                        options={[
                            { value: ESubjectChapterPriority.HIGH, label: 'High' },
                            { value: ESubjectChapterPriority.MEDIUM, label: 'Medium' },
                            { value: ESubjectChapterPriority.LOW, label: 'Low' },
                        ]}
                    />
                </section>

                <AppForm.Textarea<subjectChapterSchemaType>
                    rows={10}
                    name="content"
                    label="Content description"
                    placeholder="eg. Describe the content of the chapter"
                    required
                />

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel action={onDialogClose}>Cancel</AppForm.Cancel>
                    <AppForm.Submit>
                        {
                            !!props.subjectChapterId ? "Save changes" : "Add Chapter"
                        }
                    </AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}