import AppForm from "@/components/forms/app-form";
import ClassSelectionFormField from "@/components/forms/class-selection-form-field";
import { Button } from "@/components/ui/button";
import { QueryKey } from "@/react-query/queryKeys";
import { createQueryString } from "@/utils/create-query-string";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
    setSearchQuery: (value: string) => void;
}

const getPastStudentsSchema = z.object({
    academicYearId: z.string().uuid({ message: "Select academic year" }),
    classRoomId: z.string().uuid({ message: "Select class" }).optional(),
    sectionId: z.string().optional(),
    search: z.string().optional(),
})

type TGetPastStudentsSchema = z.infer<typeof getPastStudentsSchema>

export default function GetPastStudents({ setSearchQuery }: Props) {
    const form = useForm<TGetPastStudentsSchema>({
        resolver: zodResolver(getPastStudentsSchema),
        defaultValues: {
            academicYearId: undefined,
            classRoomId: undefined,
            sectionId: '',
            search: '',
        },
    })

    const onSubmit = (values: TGetPastStudentsSchema) => {
        setSearchQuery(createQueryString({
            classRoomId: values.classRoomId,
            sectionId: values.sectionId,
            search: values.search,
            academicYearId: values.academicYearId,
            skipPagination: 'true',
        }))
    }

    return (
        <AppForm schema={getPastStudentsSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-6">
                <AppForm.Text<TGetPastStudentsSchema>
                    name="search"
                    label="Student Name or ID"
                    placeholder="eg. Search by name or ID"
                    min={1}
                />

                <AppForm.DynamicSelect<TGetPastStudentsSchema>
                    name="academicYearId"
                    label="From academic year"
                    placeholder="Select academic year"
                    required
                    fetchOptions={{
                        endpoint: QueryKey.ACADEMIC_YEARS + '/' + QueryKey.OPTIONS,
                        queryKey: [QueryKey.ACADEMIC_YEARS, QueryKey.OPTIONS],
                        queryString: 'page=1&take=50&onlyPast=true',
                    }}
                    labelKey="label"
                    containerClassName="min-w-[200px]"
                />

                <ClassSelectionFormField include="section" noDescription />

                <Button type="submit" className="self-end" disabled={!form.watch('academicYearId')}>
                    Search
                </Button>
            </form>
        </AppForm>
    )
}