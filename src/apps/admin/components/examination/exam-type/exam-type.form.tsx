import AppForm from "@/components/forms/app-form"
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { getDirtyValues } from "@/utils/get-dirty-values";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod"

type Props = ({
    setIsOpen?: undefined;
} | {
    examTypeId?: string;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) & {
    defaultValues?: examTypeFormType;
}

export const examTypeSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Name is required' }),

    description: z
        .string()
        .max(200, { message: 'Description should not exceed 200 characters' })
        .nullish(),
})

const defaultValues: Partial<examTypeFormType> = {
    name: "",
    description: "",
}

export type examTypeFormType = z.infer<typeof examTypeSchema>;

export default function ExamTypeForm(props: Props) {
    const params = useParams();
    const id = (!!props.setIsOpen && props.examTypeId) ? props.examTypeId : params.id;

    const form = useForm<examTypeFormType>({
        resolver: zodResolver(examTypeSchema),
        defaultValues: props?.defaultValues ?? defaultValues,
    })

    const { mutateAsync } = useAppMutation<Partial<examTypeFormType>, any>();

    async function onSubmit(values: examTypeFormType) {
        const method = ((!!props.setIsOpen && props.examTypeId) || params.id) ? "patch" : "post";

        const response = await mutateAsync({
            method,
            endpoint: QueryKey.EXAM_TYPES,
            id,
            data: getDirtyValues(values, form),
            invalidateTags: [QueryKey.EXAM_TYPES],
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
        <AppForm schema={examTypeSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <AppForm.Text<examTypeFormType>
                    name="name"
                    label="Name" 
                    description="Enter the name of exam type."
                    required
                    placeholder="e.g. Board Exam"
                />
                <AppForm.Textarea<examTypeFormType>
                    containerClassName="grow"
                    name="description"
                    label="Description"
                    description="Any additional description."
                    placeholder="eg. This exam type helps students to prepare for the board exam."
                />

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel action={onDialogClose}>Cancel</AppForm.Cancel>
                    <AppForm.Submit>
                        {
                            !!id ? "Save changes" : "Add Type"
                        }
                    </AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}