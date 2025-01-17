import AppForm from "@/components/forms/app-form";
import ClassSelectionFormField from "@/components/forms/class-selection-form-field";
import { Button } from "@/components/ui/button";
import { createQueryString } from "@/utils/create-query-string";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
    setSearchQuery: (value: string) => void;
}

const getstudentsSchema = z.object({
    classRoomId: z.string().uuid({ message: "Select class" }).optional(),
    sectionId: z.string().optional(),
    studentId: z.string().optional(),
})

type TGetstudentsSchema = z.infer<typeof getstudentsSchema>

export default function GetstudentsForm({ setSearchQuery }: Props) {
    const form = useForm<TGetstudentsSchema>({
        resolver: zodResolver(getstudentsSchema),
        defaultValues: {
            classRoomId: undefined,
            sectionId: '',
            studentId: '',
        },
    })

    const onSubmit = (values: TGetstudentsSchema) => {
        setSearchQuery(createQueryString({
            classRoomId: values.classRoomId,
            sectionId: values.sectionId,
            studentId: values.studentId,
            skipPagination: 'true',
        }))
    }

    return (
        <AppForm schema={getstudentsSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-6">

                <AppForm.Text<TGetstudentsSchema>
                    name="studentId"
                    label="Student ID"
                    placeholder="eg. 123456"
                    min={1}
                />

                <ClassSelectionFormField include="section" noDescription />

                <Button type="submit" className="self-end" disabled={!Object.keys(form.formState.dirtyFields).length}>
                    Search
                </Button>
            </form>
        </AppForm>
    )
}