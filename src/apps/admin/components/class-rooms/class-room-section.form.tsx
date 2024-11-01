import AppForm from "@/components/forms/app-form"
import { useAuth } from "@/contexts/auth-provider";
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { classRoomFormDefaultValues, classRoomFormSchema, classRoomFormSchemaType } from "@/schemas/class-room.schema";
import { EClassType } from "@/types/global.type";
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
    parentClassId: string
}

export default function ClassSectionForm(props: Props) {
    const params = useParams();
    const id = (!!props.setIsOpen && props.classRoomId) ? props.classRoomId : params.id;

    const navigate = useNavigate();
    const { payload } = useAuth();

    const form = useForm<classRoomFormSchemaType>({
        resolver: zodResolver(classRoomFormSchema),
        defaultValues: props?.defaultValues ?? classRoomFormDefaultValues,
    })

    const { mutateAsync } = useAppMutation<Partial<classRoomFormSchemaType & { parentClassId: string }>, any>();

    async function onSubmit(values: classRoomFormSchemaType) {
        const method = ((!!props.setIsOpen && props.classRoomId) || params.id) ? "patch" : "post";

        const response = await mutateAsync({
            method,
            endpoint: QueryKey.CLASSES,
            id,
            data: {
                ...getDirtyValues(values, form),
                classType: EClassType.SECTION,
                parentClassId: props.parentClassId,
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
                <section className="flex flex-col gap-8">
                    <AppForm.Text<classRoomFormSchemaType>
                        name="name"
                        label="Section name"
                        placeholder="eg. Section A"
                        description="Enter the name of the section"
                        required
                    />

                    <AppForm.Text<classRoomFormSchemaType>
                        name="location"
                        label="Location"
                        placeholder="eg. Room No. 34, Block 1"
                        description="Enter the location of the section"
                    />

                    <AppForm.DynamicCombobox<classRoomFormSchemaType>
                        name='classTeacherId'
                        label='Class Teacher'
                        placeholder='Select class teacher'
                        description='Select the class teacher'
                        queryKey={QueryKey.TEACHERS}
                    />
                </section>

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel action={onDialogClose}>Cancel</AppForm.Cancel>
                    <AppForm.Submit>
                        {
                            !!id ? "Save changes" : "Add section"
                        }
                    </AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}