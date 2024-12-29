import AppForm from "@/components/forms/app-form"
import { useAuth } from "@/contexts/auth-provider";
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { classRoomFormDefaultValues, classRoomFormSchema, classRoomFormSchemaType } from "@/schemas/class-room.schema";
import { EClassType, SelectOption } from "@/types/global.type";
import { getDirtyValues } from "@/utils/get-dirty-values";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

type Props = ({
    setIsOpen?: undefined;
} | {
    classRoomId?: string;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) & {
    defaultValues?: Partial<classRoomFormSchemaType>;
    selectedClassTeacherOption?: SelectOption;
}

export default function ClassRoomForm(props: Props) {
    const params = useParams();
    const id = (!!props.setIsOpen && props.classRoomId) ? props.classRoomId : params.id;

    const navigate = useNavigate();
    const { payload } = useAuth();

    const form = useForm<classRoomFormSchemaType>({
        resolver: zodResolver(id ? classRoomFormSchema.omit({ admissionFee: true, monthlyFee: true }) : classRoomFormSchema),
        defaultValues: props?.defaultValues ?? classRoomFormDefaultValues,
    })

    const { mutateAsync } = useAppMutation<Partial<classRoomFormSchemaType>, any>();

    async function onSubmit(values: classRoomFormSchemaType) {
        const method = ((!!props.setIsOpen && props.classRoomId) || params.id) ? "patch" : "post";

        const response = await mutateAsync({
            method,
            endpoint: QueryKey.CLASSES,
            id,
            data: {
                ...getDirtyValues(values, form),
                classTeacherId: values.classTeacherId ?? null,
                classType: EClassType.PRIMARY,
            },
            invalidateTags: [QueryKey.CLASSES],
        });

        if (response?.data?.message) {
            onDialogClose();
            navigate(`/${payload?.role}/classes`);
        }
    }

    const onDialogClose = () => {
        form.reset();
        props.setIsOpen && props.setIsOpen(false);
    }

    return (
        <AppForm schema={classRoomFormSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <section className="grid lg:grid-cols-2 gap-8 grid-cols-1">
                    <AppForm.Text<classRoomFormSchemaType>
                        name="name"
                        label="Class name"
                        placeholder="eg. Class 1"
                        description="Enter the name of the class"
                        required
                    />

                    {
                        !id && (
                            <>
                                <AppForm.Number<classRoomFormSchemaType>
                                    name="admissionFee"
                                    label="Admission fee"
                                    placeholder="eg. 1000"
                                    description="Enter the admission fee"
                                    required
                                    min={0}
                                />

                                <AppForm.Number<classRoomFormSchemaType>
                                    name="monthlyFee"
                                    label="Monthly fee"
                                    placeholder="eg. 1000"
                                    description="Enter the monthly fee"
                                    required
                                    min={0}
                                />
                            </>
                        )
                    }

                    <AppForm.Text<classRoomFormSchemaType>
                        name="location"
                        label="Location"
                        placeholder="eg. Room No. 34, Block 1"
                        description="Enter the location of the class"
                    />

                    <AppForm.DynamicCombobox<classRoomFormSchemaType>
                        name='classTeacherId'
                        label='Class Teacher'
                        placeholder='Select class teacher'
                        description='Select the class teacher'
                        queryKey={QueryKey.TEACHERS}
                        defaultSelected={props.selectedClassTeacherOption}
                    />

                </section>


                <AppForm.Textarea<classRoomFormSchemaType>
                    rows={3}
                    name="description"
                    label="Description"
                    placeholder="eg. Describe about the class here"
                    description="Any description for the class?"
                />

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel action={onDialogClose}>Cancel</AppForm.Cancel>
                    <AppForm.Submit>
                        {
                            !!id ? "Save changes" : "Add class"
                        }
                    </AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}