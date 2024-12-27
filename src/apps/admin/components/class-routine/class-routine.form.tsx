import AppForm from "@/components/forms/app-form"
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { classRoutineDefaultValues, classRoutineSchema, classRoutineSchemaType } from "../../schemas/class-routine.schema";
import { DayOfWeekMappings, RoutineTypeMappings } from "@/utils/labelToValueMappings";
import { createQueryString } from "@/utils/create-query-string";
import { ERoutineType, SelectOption } from "@/types/global.type";
import { ClassSectionFormField } from "@/components/forms/class-section-form-field";

type Props = ({
    setIsOpen?: undefined;
} | {
    classRoutineId?: string;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) & {
    defaultValues?: Partial<classRoutineSchemaType>;
    selectedTeacher?: SelectOption;
}

export default function ClassRoutineForm(props: Props) {
    const params = useParams();
    const id = (!!props.setIsOpen && props.classRoutineId) ? props.classRoutineId : params.id;

    const form = useForm<classRoutineSchemaType>({
        resolver: zodResolver(classRoutineSchema),
        defaultValues: props?.defaultValues ?? classRoutineDefaultValues,
    })

    const { mutateAsync } = useAppMutation<Partial<classRoutineSchemaType>, any>();

    async function onSubmit(values: classRoutineSchemaType) {
        const method = ((!!props.setIsOpen && props.classRoutineId) || params.id) ? "patch" : "post";

        const response = await mutateAsync({
            method,
            endpoint: QueryKey.CLASSROUTINE,
            id,
            data: {
                ...values,
                classRoomId: (values.sectionId ?? values.classRoomId), // should have to send the section Id as classRoomId to add the class routine for that section
            },
            invalidateTags: [QueryKey.CLASSROUTINE],
        });

        if (response?.data?.message) {
            onDialogClose();
        }
    }

    const onDialogClose = () => {
        props.setIsOpen && props.setIsOpen(false);
    }

    return (
        <AppForm schema={classRoutineSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <section className="grid lg:grid-cols-2 gap-8 grid-cols-1">
                    <AppForm.Select<classRoutineSchemaType>
                        name="type"
                        label="Routine type"
                        placeholder="Select type"
                        description="Select the type of routine"
                        required
                        options={Object.entries(RoutineTypeMappings).map(([label, value]) => ({ label, value }))}
                        value={form.watch('type') ?? ''}
                    />

                    <ClassSectionFormField />

                    { // while on edit, no need to update subject
                        !id && <>
                            <AppForm.DynamicSelect<classRoutineSchemaType>
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
                                required={form.watch('type') === ERoutineType.CLASS}
                                disabled={!form.watch('classRoomId') || form.watch('type') === ERoutineType.BREAK}
                            />
                        </>
                    }
                    <AppForm.DynamicSelect<classRoutineSchemaType>
                        name="teacherId"
                        label="Teacher"
                        placeholder="Select teacher"
                        description="Select the teacher"
                        fetchOptions={{
                            endpoint: QueryKey.TEACHERS + '/' + QueryKey.OPTIONS,
                            queryKey: form.watch('subjectId') ? [QueryKey.TEACHERS, form.watch('subjectId') ?? ''] : [QueryKey.TEACHERS],
                            queryString: createQueryString({
                                assignedSubjectId: form.watch('subjectId'),
                            }),
                            options: {
                                enabled: !!form.watch('subjectId'),
                            }
                        }}
                        labelKey={'label'}
                        disabled={!form.watch('subjectId') || form.watch('type') === ERoutineType.BREAK}
                    />


                    <AppForm.Select<classRoutineSchemaType>
                        name="dayOfTheWeek"
                        label="Day of the week"
                        placeholder="Select day"
                        description="Select the day of the week"
                        required
                        options={Object.entries(DayOfWeekMappings).map(([label, value]) => ({ label, value }))}
                        value={form.watch('dayOfTheWeek') ?? ''}
                    />

                    <AppForm.TimePicker<classRoutineSchemaType>
                        name="startTime"
                        label="Start time"
                        placeholder="Select start time"
                        required
                        description="Start time of the period"
                    />

                    <AppForm.TimePicker<classRoutineSchemaType>
                        name="endTime"
                        label="End time"
                        placeholder="Select end time"
                        required
                        description="End time of the period"
                    />

                </section>

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel action={onDialogClose}>Cancel</AppForm.Cancel>
                    <AppForm.Submit>
                        {
                            !!id ? "Save changes" : "Add routine"
                        }
                    </AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}