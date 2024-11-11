import AppForm from "@/components/forms/app-form";
import { Button } from "@/components/ui/button";
import { QueryKey } from "@/react-query/queryKeys";
import { createQueryString } from "@/utils/create-query-string";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
    setSearchQuery: (value: string) => void;
}

const formSchema = z.object({
    studentId: z.string({ required_error: "Student ID is required" }).min(1, { message: "Student ID is required" }),
    examTypeId: z.string({ required_error: "Please select exam type" }).uuid({ message: "Select exam type" }),
})

type TFormSchema = z.infer<typeof formSchema>

export default function GetExamReportByStudentForm({ setSearchQuery }: Props) {
    const form = useForm<TFormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            studentId: '',
            examTypeId: '',
        }
    });

    const onSubmit = (values: TFormSchema) => {
        setSearchQuery(createQueryString(values));
    }

    return (
        <section className="p-6 rounded-lg border">
            <AppForm schema={formSchema} form={form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-6">
                    <AppForm.Text<TFormSchema>
                        name="studentId"
                        label="Student ID"
                        placeholder="eg. 123456"
                        min={1}
                    />

                    <AppForm.DynamicCombobox<TFormSchema>
                        name="examTypeId"
                        label="Exam Type"
                        placeholder="Select exam type"
                        queryKey={QueryKey.EXAM_TYPES}
                        disableOnNoOption
                        containerClassName="w-[200px]"
                    />

                    <Button
                        type="submit"
                        disabled={!form.getValues("studentId") || !form.getValues("examTypeId")}
                        className="self-end"
                    >
                        Get Report
                    </Button>
                </form>
            </AppForm>
        </section>
    )
}