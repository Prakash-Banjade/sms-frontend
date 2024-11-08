import AppForm from "@/components/forms/app-form";
import { ClassSectionFormField } from "@/components/forms/class-section-form-field";
import { Button } from "@/components/ui/button";
import { QueryKey } from "@/react-query/queryKeys";
import { createQueryString } from "@/utils/create-query-string";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
    setSearchQuery: (value: string) => void;
}

const getExamSubjectsSchema = z.object({
    classRoomId: z.string().uuid({ message: "Select class" }).optional(),
    examTypeId: z.string().uuid({ message: "Select exam type" }).optional(),
    sectionId: z.string().optional(),
})

type TGetExamSubjectsSchema = z.infer<typeof getExamSubjectsSchema>

export default function GetExamSubjectsForm({ setSearchQuery }: Props) {
    const form = useForm<TGetExamSubjectsSchema>({
        resolver: zodResolver(getExamSubjectsSchema),
        defaultValues: {
            classRoomId: undefined,
            sectionId: '',
            examTypeId: undefined,
        },
    })

    const onSubmit = (values: TGetExamSubjectsSchema) => {
        setSearchQuery(createQueryString({
            classRoomId: values.classRoomId,
            sectionId: values.sectionId,
            examTypeId: values.examTypeId,
            skipPagination: 'true',
        }))
    }

    return (
        <AppForm schema={getExamSubjectsSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-6">

                <AppForm.DynamicCombobox<TGetExamSubjectsSchema>
                    name="examTypeId"
                    label="Exam Type"
                    placeholder="Select exam type"
                    queryKey={QueryKey.EXAM_TYPES}
                    disableOnNoOption
                    containerClassName="w-[200px]"
                />

                <ClassSectionFormField noDescription containerClassName='w-[200px]' required={false} />

                <Button type="submit" className="self-end" disabled={!form.getValues('examTypeId') || !form.getValues('classRoomId')}>
                    Search
                </Button>
            </form>
        </AppForm>
    )
}