import AppForm from "@/components/forms/app-form"
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { IStudenIdtWithRoll } from "@/apps/admin/pages/students-management/student-promotion.page";
import ClassSelectionFormField from "@/components/forms/class-selection-form-field";
import { useFacultySearch } from "@/hooks/useFacultySearch";
import { createQueryString } from "@/utils/create-query-string";

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
})

const defaultValues: Partial<studentPromotionSchemaType> = {
    classRoomId: undefined,
    sectionId: undefined,
}

export type studentPromotionSchemaType = z.infer<typeof studentPromotionSchema>;

export default function StudentPromotionForm({ selectedStudentsWithRoll, setIsOpen, searchQuery }: Props) {
    const form = useForm<studentPromotionSchemaType>({
        resolver: zodResolver(studentPromotionSchema),
        defaultValues: defaultValues,
    });
    const { hasSection } = useFacultySearch(createQueryString({ include: "section" }));
    const { mutateAsync } = useAppMutation<studentPromotionSchemaType & { studentsWithRollNo: IStudenIdtWithRoll[] }, any>();

    async function onSubmit(values: studentPromotionSchemaType) {
        // check if section is selected or not
        if (hasSection(values.classRoomId) && !values.sectionId) {
            form.setError("sectionId", { type: "required", message: "Section is required" });
            form.setFocus("sectionId");
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
                <ClassSelectionFormField include="section" required={{ facultyId: true, classRoomId: true }} />

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