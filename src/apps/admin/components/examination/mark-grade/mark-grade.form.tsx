import AppForm from "@/components/forms/app-form"
import { GRADE_REGEX } from "@/CONSTANTS";
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
    markGradeId?: string;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) & {
    defaultValues?: markGradeFormType;
}

export const markGradeSchema = z.object({
    gradeName: z.string()
        .min(1, { message: "Grade name is required" })
        .regex(GRADE_REGEX, { message: "Invalid grade name format" }),
    gradeScale: z.coerce.number()
        .int({ message: "Grade scale must be an integer" })
        .min(1, { message: "Grade scale must be at least 1" }),
    percentFrom: z.coerce.number()
        .nonnegative({ message: "Percent from must be 0 or more" })
        .max(99, { message: "Percent from must be 99 or less" }),
    percentTo: z.coerce.number()
        .min(1, { message: "Percent to must be at least 1" })
        .max(100, { message: "Percent to must be 100 or less" }),
    gpaFrom: z.coerce.number()
        .min(1, { message: "GPA from must be at least 1" }),
    gpaTo: z.coerce.number()
        .min(1, { message: "GPA to must be at least 1" }),
    description: z.string().nullish(),
})

const defaultValues: Partial<markGradeFormType> = {
    gradeName: "",
    gradeScale: undefined,
    percentFrom: undefined,
    percentTo: undefined,
    gpaFrom: undefined,
    gpaTo: undefined,
    description: "",
}

export type markGradeFormType = z.infer<typeof markGradeSchema>;

export default function MarkGradeForm(props: Props) {
    const params = useParams();
    const id = (!!props.setIsOpen && props.markGradeId) ? props.markGradeId : params.id;

    const form = useForm<markGradeFormType>({
        resolver: zodResolver(markGradeSchema),
        defaultValues: props?.defaultValues ?? defaultValues,
    })

    const { mutateAsync } = useAppMutation<Partial<markGradeFormType>, any>();

    async function onSubmit(values: markGradeFormType) {
        const method = ((!!props.setIsOpen && props.markGradeId) || params.id) ? "patch" : "post";

        const response = await mutateAsync({
            method,
            endpoint: QueryKey.MARKS_GRADES,
            id,
            data: getDirtyValues(values, form),
            invalidateTags: [QueryKey.MARKS_GRADES],
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
        <AppForm schema={markGradeSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 @container">
                <section className="grid @lg:grid-cols-2 grid-cols-1 gap-4">
                    <AppForm.Text<markGradeFormType>
                        name="gradeName"
                        label="Grade Name"
                        description="Enter the name of grade."
                        required
                        placeholder="e.g. A+"
                    />
                    <AppForm.Number<markGradeFormType>
                        name="gradeScale"
                        label="Grade Scale"
                        description="Enter the grade scale."
                        required
                        placeholder="e.g. 4"
                        min={1}
                    />
                    <AppForm.Number<markGradeFormType>
                        name="percentFrom"
                        label="Percent From"
                        description="Percentage from the grade is applied."
                        required
                        placeholder="e.g. 90"
                        min={1}
                        max={100}
                        step={0.01}
                    />
                    <AppForm.Number<markGradeFormType>
                        name="percentTo"
                        label="Percent To"
                        description="Percentage to the grade is applied."
                        required
                        placeholder="e.g. 100"
                        min={1}
                        max={100}
                        step={0.01}
                    />
                    <AppForm.Number<markGradeFormType>
                        name="gpaFrom"
                        label="GPA From"
                        description="GPA from the grade is applied."
                        required
                        placeholder="e.g. 3.5"
                        min={1}
                        step={0.01}
                    />
                    <AppForm.Number<markGradeFormType>
                        name="gpaTo"
                        label="GPA To"
                        description="GPA to the grade is applied."
                        required
                        placeholder="e.g. 4.0"
                        min={1}
                        step={0.01}
                    />
                </section>
                <AppForm.Textarea<markGradeFormType>
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
                            !!id ? "Save changes" : "Add Grade"
                        }
                    </AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}