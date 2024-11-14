import AppForm from "@/components/forms/app-form"
import { useAuth } from "@/contexts/auth-provider";
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { subjectFormDefaultValues, subjectFormSchema, subjectFormSchemaType, } from "@/schemas/subject.schema";
import { TClassesResponse } from "@/types/class.type";
import { ESubjectType } from "@/types/global.type";
import { getDirtyValues } from "@/utils/get-dirty-values";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

type Props = ({
    setIsOpen?: undefined;
} | {
    subjectId?: string;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) & {
    defaultValues?: Partial<subjectFormSchemaType>;
}

export default function SubjectForm(props: Props) {
    const params = useParams();
    const id = (!!props.setIsOpen && props.subjectId) ? props.subjectId : params.id;

    const navigate = useNavigate();
    const { payload } = useAuth();

    const form = useForm<subjectFormSchemaType>({
        resolver: zodResolver(subjectFormSchema),
        defaultValues: props?.defaultValues ?? subjectFormDefaultValues,
    })

    const { mutateAsync } = useAppMutation<Partial<subjectFormSchemaType>, any>();

    async function onSubmit(values: subjectFormSchemaType) {
        const method = ((!!props.setIsOpen && props.subjectId) || params.id) ? "patch" : "post";

        const response = await mutateAsync({
            method,
            endpoint: QueryKey.SUBJECTS,
            id,
            data: {
                ...getDirtyValues(values, form),
                classRoomId: values.classRoomId ?? null,
                teacherId: values.teacherId ?? null,
                type: values.type,
            },
            invalidateTags: [QueryKey.SUBJECTS],
        });

        if (response?.data?.message) {
            onDialogClose();
            navigate(`/${payload?.role}/subjects`);
        }
    }

    const onDialogClose = () => {
        form.reset();
        props.setIsOpen && props.setIsOpen(false);
    }

    return (
        <AppForm schema={subjectFormSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="@container space-y-8">
                <section className="grid @2xl:grid-cols-2 @4xl:grid-cols-3 gap-8 grid-cols-1">
                    <AppForm.Text<subjectFormSchemaType>
                        name="subjectName"
                        label="Subject name"
                        placeholder="eg. Hamro Nepali"
                        description="Enter the name of the subject"
                        required
                    />

                    <AppForm.Text<subjectFormSchemaType>
                        name="subjectCode"
                        label="Subject Code"
                        placeholder="eg. HM101"
                        description="Enter the subject code"
                        required
                    />

                    <section>
                        <AppForm.Select<subjectFormSchemaType>
                            name="type"
                            label="Subject Type"
                            placeholder="Select subject type"
                            required
                            options={Object.entries(ESubjectType).map(([key, value]) => ({ label: key, value: value }))}
                        />
                        <p className="text-sm text-info mt-2">! Note: It is not recommended to change the subject type once created. May cause unexpected issues.</p>
                    </section>

                    <AppForm.Number<subjectFormSchemaType>
                        name="theoryFM"
                        label="Theory full mark"
                        placeholder="eg. 100"
                        description="Enter the theory full mark"
                        required
                    />

                    <AppForm.Number<subjectFormSchemaType>
                        name="theoryPM"
                        label="Theory pass mark"
                        placeholder="eg. 20"
                        description="Enter the theory pass mark"
                        required
                    />

                    <AppForm.Number<subjectFormSchemaType>
                        name="practicalFM"
                        label="Practical full mark"
                        placeholder="eg. 100"
                        description="Enter the practical full mark"
                        required
                    />

                    <AppForm.Number<subjectFormSchemaType>
                        name="practicalPM"
                        label="Practical pass mark"
                        placeholder="eg. 20"
                        description="Enter the practical pass mark"
                        required
                    />

                    <AppForm.DynamicSelect<subjectFormSchemaType, TClassesResponse>
                        name="classRoomId"
                        label="Class room"
                        placeholder="Select class room"
                        description="Select the class room. Can assigned later."
                        fetchOptions={{
                            endpoint: QueryKey.CLASSES + '/' + QueryKey.OPTIONS,
                            queryKey: [QueryKey.CLASSES, QueryKey.OPTIONS],
                            queryString: 'page=1&take=50',
                        }}
                        labelKey={'name'}
                    />

                    <AppForm.DynamicSelect_V2<subjectFormSchemaType>
                        name="teacherId"
                        label="Subject Teacher"
                        placeholder="Select teacher"
                        description="Select the subject teacher. Can assigned later."
                        queryKey={QueryKey.TEACHERS}
                    />

                </section>

                <AppForm.Textarea<subjectFormSchemaType>
                    rows={5}
                    name="content"
                    label="Content description"
                    placeholder="eg. Describe the content of the subject"
                    description="Any description for the subject?"
                    required
                />

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel action={onDialogClose}>Cancel</AppForm.Cancel>
                    <AppForm.Submit>
                        {
                            !!id ? "Save changes" : "Add subject"
                        }
                    </AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}