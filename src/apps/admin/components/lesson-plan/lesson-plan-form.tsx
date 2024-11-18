import AppForm from "@/components/forms/app-form"
import { ClassSectionFormField } from "@/components/forms/class-section-form-field";
import { useAuth } from "@/contexts/auth-provider";
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { createQueryString } from "@/utils/create-query-string";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useGetClassRoomsOptions } from "../class-rooms/actions";
import { lessonPlanDefaultValues, lessonPlanSchema, lessonPlanSchemaType } from "../../schemas/lesson-plan.schema";
import { IFileUploadResponse } from "@/types/global.type";

type Props = ({
    lessonPlanId?: undefined;
    attachments?: undefined;
    defaultValues?: undefined;
} | {
    lessonPlanId: string;
    defaultValues: Partial<lessonPlanSchemaType>;
    attachments: IFileUploadResponse['files'];
})

export default function LessonPlanForm(props: Props) {
    const navigate = useNavigate();
    const { payload } = useAuth();

    // fetching options outside to validate class room and sections
    const { data, isLoading } = useGetClassRoomsOptions({ queryString: 'page=1&take=50' });

    const form = useForm<lessonPlanSchemaType>({
        resolver: zodResolver(lessonPlanSchema),
        defaultValues: {
            ...(props.lessonPlanId ? props?.defaultValues : lessonPlanDefaultValues),
        },
    })

    const { mutateAsync } = useAppMutation<Partial<Omit<lessonPlanSchemaType, 'sectionIds'> & { classRoomIds: string[] }>, any>();

    async function onSubmit(values: lessonPlanSchemaType) {
        console.log(123)
        // check if section is selected or not
        if (data?.find(classRoom => classRoom.id === values.classRoomId)?.children?.length && !values.sectionIds?.length) {
            form.setError("sectionIds", { type: "required", message: "Section is required" });
            return;
        }

        const method = !!props.lessonPlanId ? "patch" : "post";

        const response = await mutateAsync({
            method,
            endpoint: QueryKey.LESSON_PLANS,
            id: props.lessonPlanId,
            data: {
                ...values,
                classRoomIds: values.sectionIds?.length ? values.sectionIds : [values.classRoomId], // need to send as classRoomIds not section Ids
                attachmentIds: values.attachmentIds,
            },
            invalidateTags: [QueryKey.LESSON_PLANS],
        });

        if (response?.data?.message) {
            navigate(`/${payload?.role}/lesson-plans`);
        }
    }

    console.log(form.formState.errors)
    console.log(form.watch())

    return (
        <AppForm schema={lessonPlanSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <section className="grid lg:grid-cols-2 gap-8 grid-cols-1">
                    <AppForm.Text<lessonPlanSchemaType>
                        name="title"
                        label="Title"
                        placeholder="eg. Complete the lesson plan"
                        description={`Enter the title for lesson plan.`}
                        required
                    />

                    <ClassSectionFormField multipleSections options={data ?? []} isLoading={isLoading} />

                    <AppForm.DynamicSelect<lessonPlanSchemaType>
                        name="subjectId"
                        label="Subject"
                        placeholder="Select subject"
                        description="Select the subject"
                        fetchOptions={{
                            endpoint: QueryKey.SUBJECTS + '/' + QueryKey.OPTIONS,
                            queryKey: [QueryKey.SUBJECTS, form.watch('classRoomId')],
                            queryString: createQueryString({
                                classRoomId: form.watch('classRoomId'),
                            }),
                            options: {
                                enabled: !!form.watch('classRoomId'),
                            }
                        }}
                        labelKey={'subjectName'}
                        required
                        disableOnNoOption
                    />

                    <AppForm.DatePicker<lessonPlanSchemaType>
                        name="startDate"
                        label="Start Date"
                        description={`Enter the start date for lesson plan.`}
                        required
                        min={new Date().toISOString().split('T')[0]}
                    />

                    <AppForm.DatePicker<lessonPlanSchemaType>
                        name="endDate"
                        label="End Date"
                        description={`Enter the end date for lesson plan.`}
                        required
                        min={new Date().toISOString().split('T')[0]}
                    />

                    <AppForm.Textarea<lessonPlanSchemaType>
                        rows={8}
                        name="description"
                        label="Description"
                        placeholder={`eg. Write some details about lesson plan here`}
                        required
                    />

                    <AppForm.FileUpload<lessonPlanSchemaType>
                        name="attachmentIds"
                        label="Attachments"
                        placeholder="Upload attachments"
                        description="Image, PDF | Max 5 files | 5 MB each"
                        multiple
                        maxLimit={5}
                        initialUpload={props.attachments ?? []}
                        accept="image/png, image/jpeg, image/jpg, image/webp, application/pdf"
                        required
                    />
                </section>

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel action={() => navigate(`/admin/lesson-plans`)}>Cancel</AppForm.Cancel>
                    <AppForm.Submit className="capitalize">
                        {
                            !!props.lessonPlanId ? "Save changes" : `Create Plan`
                        }
                    </AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}