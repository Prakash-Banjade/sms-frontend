import AppForm from "@/components/forms/app-form"
import { ClassSectionFormField } from "@/components/forms/class-section-form-field";
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { useGetClassRoomsOptions } from "../../class-rooms/actions";

type Props = {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedStudentIds: string[];
}

const changeClassSchema = z.object({
    classRoomId: z.string({ required_error: 'Class room is required' }).uuid({ message: 'Invalid class room' }),
    sectionId: z.string()
        .uuid({ message: 'Invalid class section. Must be a valid UUID' })
        .optional(),
})

const defaultValues: Partial<changeClassSchemaType> = {
    classRoomId: undefined,
    sectionId: undefined,
}

export type changeClassSchemaType = z.infer<typeof changeClassSchema>;

export default function ChangeClassForm({ selectedStudentIds, setIsOpen }: Props) {
    // fetching options outside to validate class room and sections
    const { data, isLoading } = useGetClassRoomsOptions({ queryString: 'page=1&take=50' });

    const form = useForm<changeClassSchemaType>({
        resolver: zodResolver(changeClassSchema),
        defaultValues: defaultValues,
    })

    const { mutateAsync } = useAppMutation<changeClassSchemaType & { studentIds: string[] }, any>();

    async function onSubmit(values: changeClassSchemaType) {
        // check if section is selected or not
        if (data?.data?.find(classRoom => classRoom.id === values.classRoomId)?.children?.length && !values.sectionId) {
            form.setError("sectionId", { type: "required", message: "Section is required" });
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
                <ClassSectionFormField options={data?.data ?? []} isLoading={isLoading} />

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel action={() => setIsOpen(false)}>Cancel</AppForm.Cancel>
                    <AppForm.Submit>Update Class</AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}