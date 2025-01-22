import AppForm from "@/components/forms/app-form"
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import ClassSelectionFormField from "@/components/forms/class-selection-form-field";
import { useFacultySearch } from "@/hooks/useFacultySearch";
import { createQueryString } from "@/utils/create-query-string";

type Props = {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedStudentIds: string[];
}

const changeClassSchema = z.object({
    classRoomId: z.string({ required_error: 'Class room is required' }).uuid({ message: 'Invalid class room' }),
    sectionId: z.string()
        .transform((val) => (val === '' ? undefined : val))
        .refine((val) => val === undefined || z.string().uuid().safeParse(val).success, {
            message: 'Invalid section ID',
        })
        .nullish(),
})

const defaultValues: Partial<changeClassSchemaType> = {
    classRoomId: undefined,
    sectionId: undefined,
}

export type changeClassSchemaType = z.infer<typeof changeClassSchema>;

export default function ChangeClassForm({ selectedStudentIds, setIsOpen }: Props) {
    const form = useForm<changeClassSchemaType>({
        resolver: zodResolver(changeClassSchema),
        defaultValues: defaultValues,
    })

    const { mutateAsync } = useAppMutation<changeClassSchemaType & { studentIds: string[] }, any>();
    const { hasSection } = useFacultySearch(createQueryString({ include: "section" }));

    async function onSubmit(values: changeClassSchemaType) {
        // check if section is selected or not
        if (hasSection(values.classRoomId) && !values.sectionId) {
            form.setError("sectionId", { type: "required", message: "Section is required" });
            form.setFocus("sectionId");
            return;
        }

        const response = await mutateAsync({
            method: 'patch',
            endpoint: QueryKey.STUDENTS + '/change-class',
            data: {
                ...values,
                classRoomId: values.sectionId ?? values.classRoomId, // should have to send the section Id as classRoomId
                studentIds: selectedStudentIds,
            },
            invalidateTags: [QueryKey.STUDENTS],
        });

        if (response?.data?.message) {
            setIsOpen(false);
        }
    }

    return (
        <AppForm schema={changeClassSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <ClassSelectionFormField include="section" required={{ facultyId: true, classRoomId: true }} />

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel action={() => setIsOpen(false)}>Cancel</AppForm.Cancel>
                    <AppForm.Submit>Update Class</AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}