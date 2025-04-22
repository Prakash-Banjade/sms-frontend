import AppForm from "@/components/forms/app-form";
import { Button } from "@/components/ui/button";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { QueryKey } from "@/react-query/queryKeys";
import { createQueryString } from "@/utils/create-query-string";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    examTypeId: z.string({ required_error: "Please select exam type" }).uuid({ message: "Select exam type" }),
    academicYearId: z.string({ required_error: "Please select academic year" }).uuid({ message: "Select academic year" }),
});
type TFormSchema = z.infer<typeof formSchema>

export default function ExamReportSearch() {
    const { searchParams, setSearchParams } = useCustomSearchParams();

    const defaultValues = useMemo(() => {
        const values = {
            examTypeId: searchParams.get('examTypeId') ?? '',
            academicYearId: searchParams.get('academicYearId') ?? '',
        };

        const { success, data } = formSchema.safeParse(values);

        if (success) return data;

        return {
            examTypeId: undefined,
            academicYearId: undefined,
        }
    }, [])

    const form = useForm<TFormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const onSubmit = (values: TFormSchema) => {
        setSearchParams('examTypeId', values.examTypeId);
        setSearchParams('academicYearId', values.academicYearId);
    }

    return (
        <section className="p-6 rounded-lg border">
            <AppForm schema={formSchema} form={form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-6">
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
                        queryString={createQueryString({
                            academicYearId: form.watch("academicYearId")
                        })}
                        options={{
                            enabled: !!form.watch("academicYearId")
                        }}
                    />

                    <Button
                        type="submit"
                        disabled={!form.getValues("examTypeId")}
                        className="self-end"
                    >
                        Get My Report
                    </Button>
                </form>
            </AppForm>
        </section>
    )
}