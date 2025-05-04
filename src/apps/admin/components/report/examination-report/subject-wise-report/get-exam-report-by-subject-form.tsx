import AppForm from "@/components/forms/app-form";
import ClassSelectionFormField from "@/components/forms/class-selection-form-field";
import { Button } from "@/components/ui/button";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { QueryKey } from "@/react-query/queryKeys";
import { createQueryString } from "@/utils/create-query-string";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    facultyId: z.string({ required_error: "Please select faculty" }).uuid({ message: "Select faculty" }),
    classRoomId: z.string({ required_error: "Please select class" }).uuid({ message: "Select class" }),
    academicYearId: z.string({ required_error: "Please select academic year" }).uuid({ message: "Select academic year" }),
    examTypeId: z.string({ required_error: "Please select exam type" }).uuid({ message: "Select exam type" }),
    subjectId: z.string({ required_error: "Please select subject" }).uuid({ message: "Select subject" }),
})

type TFormSchema = z.infer<typeof formSchema>

export default function GetExamReportBySubjectForm() {
    const { searchParams, setSearchParams } = useCustomSearchParams();

    const defaultValues = useMemo(() => {
        const values = {
            facultyId: searchParams.get('facultyId') ?? '',
            classRoomId: searchParams.get('classRoomId') ?? '',
            subjectId: searchParams.get('subjectId') ?? '',
            academicYearId: searchParams.get('academicYearId') ?? '',
            examTypeId: searchParams.get('examTypeId') ?? '',
        };

        const { success, data } = formSchema.safeParse(values);

        if (success) return data;

        return {
            facultyId: undefined,
            classRoomId: undefined,
            subjectId: undefined,
            academicYearId: undefined,
            examTypeId: undefined,
        }
    }, []);

    const form = useForm<TFormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const onSubmit = (values: TFormSchema) => {
        setSearchParams('facultyId', values.facultyId);
        setSearchParams('subjectId', values.subjectId);
        setSearchParams('examTypeId', values.examTypeId);
        setSearchParams('classRoomId', values.classRoomId);
        setSearchParams('academicYearId', values.academicYearId);
    }

    useEffect(() => {
        form.setValue("subjectId", "");
    }, [form.watch('examTypeId'), form.watch('academicYearId'), form.watch('classRoomId'), form.watch('facultyId')]);

    return (
        <section className="p-6 rounded-lg border">
            <AppForm schema={formSchema} form={form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-6 flex-wrap">

                    <ClassSelectionFormField noDescription />

                    <AppForm.DynamicCombobox<TFormSchema>
                        name="academicYearId"
                        label="Academic Year"
                        placeholder="Select academic year"
                        queryKey={QueryKey.ACADEMIC_YEARS}
                        disableOnNoOption
                        containerClassName="min-w-[200px]"
                        queryString={createQueryString({
                            withActive: true
                        })}
                    />

                    <AppForm.DynamicCombobox<TFormSchema>
                        name="examTypeId"
                        label="Exam Type"
                        placeholder="Select exam type"
                        queryKey={QueryKey.EXAM_TYPES}
                        disableOnNoOption
                        containerClassName="min-w-[200px]"
                        required
                        queryString={createQueryString({
                            academicYearId: form.watch("academicYearId")
                        })}
                        options={{
                            enabled: !!form.watch("academicYearId")
                        }}
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
                            queryKey: [QueryKey.EXAM_SUBJECTS, QueryKey.OPTIONS, form.watch("classRoomId"), form.watch("examTypeId"), form.watch("academicYearId")],
                            options: { enabled: !!form.watch("classRoomId") && !!form.watch("examTypeId") },
                            queryString: createQueryString({
                                classRoomId: form.watch("classRoomId"),
                                examTypeId: form.watch("examTypeId"),
                                academicYearId: form.watch("academicYearId"),
                            }),
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