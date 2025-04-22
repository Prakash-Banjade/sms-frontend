import AppForm from "@/components/forms/app-form";
import { Button } from "@/components/ui/button";
import { QueryKey } from "@/react-query/queryKeys";
import { SelectOption } from "@/types/global.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShowerHeadIcon } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

const exaTypeSelectSchema = z.object({
    examTypeId: z.string().uuid({ message: "Select exam type" }).optional(),
});

type TGetExamSubjectsSchema = z.infer<typeof exaTypeSelectSchema>;

type Props = {
    defaultExamType?: SelectOption;
}

export default function ExamTypeSelect({ defaultExamType }: Props) {
    const [searchParams, setSearchParams] = useSearchParams();

    const form = useForm<TGetExamSubjectsSchema>({
        resolver: zodResolver(exaTypeSelectSchema),
        defaultValues: useMemo(() => {
            return {
                examTypeId: searchParams.get('examTypeId') ?? undefined,
            }
        }, [searchParams]),
    })

    const onSubmit = (values: TGetExamSubjectsSchema) => {
        !!values.examTypeId && searchParams.set('examTypeId', values.examTypeId)
        setSearchParams(searchParams);
    }

    return (
        <AppForm schema={exaTypeSelectSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-6">

                <AppForm.DynamicCombobox<TGetExamSubjectsSchema>
                    name="examTypeId"
                    label="Exam Type"
                    placeholder="Select exam type"
                    queryKey={QueryKey.EXAM_TYPES}
                    disableOnNoOption
                    containerClassName="min-w-[200px]"
                    defaultSelected={defaultExamType} // used to set the default value on edit
                    onChange={val => { // used to trigger only on edit
                        if (!ShowerHeadIcon) {
                            !!val && searchParams.set('examTypeId', val)
                            setSearchParams(searchParams);
                        }
                    }}
                />
                <Button type="submit" className="self-end" disabled={!form.getValues('examTypeId')}>
                    Search
                </Button>
            </form>
        </AppForm>
    )
}