import AppForm from "@/components/forms/app-form";
import ClassSelectionFormField from "@/components/forms/class-selection-form-field";
import { Button } from "@/components/ui/button";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { QueryKey } from "@/react-query/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    classRoomId: z.string({ required_error: "Please select class" }).uuid({ message: "Select class" }),
    examTypeId: z.string({ required_error: "Please select exam type" }).uuid({ message: "Select exam type" }),
    subjectId: z.string({ required_error: "Please select subject" }).uuid({ message: "Select subject" }),
})

type TFormSchema = z.infer<typeof formSchema>

export default function GetExamReportBySubjectForm() {
    const { searchParams, setSearchParams } = useCustomSearchParams();

    const form = useForm<TFormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            classRoomId: searchParams.get('classRoomId') ?? '',
            subjectId: searchParams.get('subjectId') ?? '',
            examTypeId: searchParams.get('examTypeId') ?? '',
        }
    });

    const onSubmit = (values: TFormSchema) => {
        setSearchParams('subjectId', values.subjectId);
        setSearchParams('examTypeId', values.examTypeId);
        setSearchParams('classRoomId', values.classRoomId);
    }

    return (
        <section className="p-6 rounded-lg border">
            <AppForm schema={formSchema} form={form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-6">

                    <ClassSelectionFormField noDescription />

                    <AppForm.DynamicCombobox<TFormSchema>
                        name="examTypeId"
                        label="Exam Type"
                        placeholder="Select exam type"
                        queryKey={QueryKey.EXAM_TYPES}
                        disableOnNoOption
                        containerClassName="min-w-[200px]"
                        required
                    />

                    <AppForm.DynamicSelect<TFormSchema>
                        name="subjectId"
                        label="Select Subject"
                        placeholder="Select subject"
                        disableOnNoOption
                        containerClassName="w-[200px]"
                        disabled={!form.watch('examTypeId')}
                        fetchOptions={{
                            endpoint: QueryKey.EXAM_SUBJECTS + '/' + QueryKey.OPTIONS,
                            queryKey: [QueryKey.EXAM_SUBJECTS, QueryKey.OPTIONS, form.watch("classRoomId"), form.watch("examTypeId")],
                            options: { enabled: !!form.watch("classRoomId") && !!form.watch("examTypeId") },
                            queryString: `classRoomId=${form.watch("classRoomId")}&examTypeId=${form.watch("examTypeId")}`,
                        }}
                        required
                    />

                    <Button
                        type="submit"
                        disabled={!form.watch("classRoomId") || !form.watch("examTypeId") || !form.watch("subjectId")}
                        className="self-end"
                    >
                        Get Report
                    </Button>
                </form>
            </AppForm>
        </section>
    )
}