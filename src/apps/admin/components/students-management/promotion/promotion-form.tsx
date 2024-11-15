import AppForm from "@/components/forms/app-form"
import { ClassSectionFormField } from "@/components/forms/class-section-form-field";
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { useGetClassRoomsOptions } from "../../class-rooms/actions";
import { IStudenIdtWithRoll } from "@/apps/admin/pages/students-management/student-promotion.page";

type Props = {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedStudentsWithRoll: IStudenIdtWithRoll[];
    searchQuery: string; // this is just to invalidate the fetched students
}

const studentPromotionSchema = z.object({
    enrollmentDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid admission date',
    }),
    classRoomId: z.string({ required_error: 'Class room is required' }).uuid({ message: 'Invalid class room' }),
    sectionId: z.string()
        .transform((val) => (val === '' ? undefined : val))
        .refine((val) => val === undefined || z.string().uuid().safeParse(val).success, {
            message: 'Invalid section ID',
        })
        .nullish(),
    academicYearId: z.string().uuid({ message: 'Invalid academic year' }),
})

const defaultValues: Partial<studentPromotionSchemaType> = {
    classRoomId: undefined,
    sectionId: undefined,
}

export type studentPromotionSchemaType = z.infer<typeof studentPromotionSchema>;

export default function StudentPromotionForm({ selectedStudentsWithRoll, setIsOpen, searchQuery }: Props) {
    // fetching options outside to validate class room and sections
    const { data, isLoading } = useGetClassRoomsOptions({ queryString: 'page=1&take=50' });

    const form = useForm<studentPromotionSchemaType>({
        resolver: zodResolver(studentPromotionSchema),
        defaultValues: defaultValues,
    })

    const { mutateAsync } = useAppMutation<studentPromotionSchemaType & { studentsWithRollNo: IStudenIdtWithRoll[] }, any>();

    async function onSubmit(values: studentPromotionSchemaType) {
        // check if section is selected or not
        if (data?.find(classRoom => classRoom.id === values.classRoomId)?.children?.length && !values.sectionId) {
            form.setError("sectionId", { type: "required", message: "Section is required" });
            return;
        }

        const response = await mutateAsync({
            method: 'post',
            endpoint: QueryKey.ENROLLMENTS,
            data: {
                ...values,
                classRoomId: values.sectionId ?? values.classRoomId, // should have to send the section Id as classRoomId
                studentsWithRollNo: selectedStudentsWithRoll,
            },
            invalidateTags: [QueryKey.STUDENTS, searchQuery],
        });

        if (response?.data?.message) {
            setIsOpen(false);
        }
    }

    return (
        <AppForm schema={studentPromotionSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <ClassSectionFormField options={data ?? []} isLoading={isLoading} />

                <AppForm.DynamicSelect<studentPromotionSchemaType>
                    name="academicYearId"
                    label="Promote Year"
                    placeholder="Select academic year"
                    description="Select the academic year"
                    required
                    fetchOptions={{
                        endpoint: QueryKey.ACADEMIC_YEARS + '/' + QueryKey.OPTIONS,
                        queryKey: [QueryKey.ACADEMIC_YEARS, QueryKey.OPTIONS],
                        queryString: 'page=1&take=50&onlyFuture=true',
                    }}
                    labelKey="label"
                />

                <AppForm.DatePicker<studentPromotionSchemaType>
                    name="enrollmentDate"
                    label="Promotion Date"
                    placeholder="Select promotion date"
                    description="Select the promotion date"
                    required
                    max={new Date().toISOString().split('T')[0]}
                />

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel action={() => setIsOpen(false)}>Cancel</AppForm.Cancel>
                    <AppForm.Submit>Promote</AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}