import AppForm from "@/components/forms/app-form"
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { classRoutineDefaultValues, classRoutineSchema, classRoutineSchemaType } from "../../schemas/class-routine.schema";
import { DayOfWeekMappings, RoutineTypeMappings } from "@/utils/labelToValueMappings";
import { createQueryString } from "@/utils/create-query-string";
import { ERoutineType, SelectOption } from "@/types/global.type";
import ClassSelectionFormField from "@/components/forms/class-selection-form-field";
import { useFacultySearch } from "@/hooks/useFacultySearch";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-provider";
import { useGetClassRoutines } from "./actions";
import { doesIntersect } from "@/lib/utils";
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog";

type Props = ({
    setIsOpen?: undefined;
    setQueryString: React.Dispatch<React.SetStateAction<string>>;
} | {
    classRoutineId?: string;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setQueryString?: undefined;
}) & {
    defaultValues?: Partial<classRoutineSchemaType>;
    selectedTeacher?: SelectOption;
}

export default function ClassRoutineForm(props: Props) {
    const params = useParams();
    const navigate = useNavigate();
    const { payload } = useAuth();
    const [confirmIntersectionOpen, setConfirmIntersectionOpen] = useState(false);
    const id = (!!props.setIsOpen && props.classRoutineId) ? props.classRoutineId : params.id;

    const form = useForm<classRoutineSchemaType>({
        resolver: zodResolver(classRoutineSchema),
        defaultValues: props?.defaultValues ?? classRoutineDefaultValues,
    });

    const { hasSection } = useFacultySearch(createQueryString({ include: "section" }));

    // this is to check if class routine time intersects with any existing class routine
    const { data: existingClassRoutines } = useGetClassRoutines({
        queryString: createQueryString({
            classRoomId: form.getValues("classRoomId"),
            sectionId: form.getValues("sectionId"),
            dayOfTheWeek: form.getValues("dayOfTheWeek"),
            skipPagination: true,
        }),
        options: {
            enabled: !!form.getValues("classRoomId") && !!form.getValues("dayOfTheWeek"),
        }
    });

    const { mutateAsync } = useAppMutation<Partial<classRoutineSchemaType>, any>();

    async function onSubmit(values: classRoutineSchemaType) {
        console.log(values)
        if (hasSection(values.classRoomId) && !values.sectionId) {
            form.setError("sectionId", { type: "required", message: "Section is required" });
            form.setFocus("sectionId");
            return;
        }

        if (values.type === ERoutineType.CLASS && !values.subjectId) {
            form.setError("subjectId", { type: "required", message: "Subject is required" });
            form.setFocus("subjectId");
            return;
        }

        // check if new class routine time intersects with any existing class routine
        if (existingClassRoutines?.data?.length) {
            const newRange = { startTime: values.startTime, endTime: values.endTime };
            const routines = id ? existingClassRoutines?.data?.filter(routine => routine.id !== id) : existingClassRoutines?.data;

            if (doesIntersect(routines, newRange)) {
                return setConfirmIntersectionOpen(true);
            }
        }

        await submit(values);
    }

    async function submit(values: classRoutineSchemaType) {
        console.log(values)
        const response = await mutateAsync({
            method: !!id ? "patch" : "post",
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

    // setting query string to show existing schedules
    useEffect(() => {
        props?.setQueryString && props?.setQueryString(createQueryString({
            classRoomId: form.watch('classRoomId'),
            sectionId: form.watch('sectionId'),
            dayOfTheWeek: form.watch('dayOfTheWeek'),
        }));
    }, [form.watch('classRoomId'), form.watch('sectionId'), form.watch('dayOfTheWeek')])

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

                    <ClassSelectionFormField
                        include="section"
                        required={{
                            facultyId: true,
                            classRoomId: true,
                        }}
                    />

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

                    <AppForm.DynamicSelect<classRoutineSchemaType>
                        name="teacherId"
                        label="Teacher"
                        placeholder="Select teacher"
                        description="Select the teacher. Can be assigned later."
                        fetchOptions={{
                            endpoint: QueryKey.TEACHERS + '/' + QueryKey.OPTIONS,
                            queryKey: [QueryKey.TEACHERS, form.watch('subjectId') ?? '', form.watch('facultyId') ?? ''],
                            queryString: createQueryString({
                                assignedSubjectId: form.watch('subjectId'),
                                facultyId: form.watch('facultyId'),
                            }),
                            options: {
                                enabled: !!form.watch('subjectId'),
                            }
                        }}
                        labelKey={'label'}
                        disabled={(form.watch('type') === ERoutineType.CLASS && !form.watch('subjectId')) || form.watch('type') === ERoutineType.BREAK}
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
                    <AppForm.Cancel action={() => {
                        onDialogClose();
                        !props.setIsOpen && navigate(`/${payload?.role}/class-routines`);
                    }}>Cancel</AppForm.Cancel>
                    <AppForm.Submit>
                        {
                            !!id ? "Save changes" : "Add routine"
                        }
                    </AppForm.Submit>
                </section>
            </form>

            <ResponsiveAlertDialog
                title="Time range conflice"
                description="Class routine time intersects with an existing class routine"
                isOpen={confirmIntersectionOpen}
                setIsOpen={setConfirmIntersectionOpen}
                action={form.handleSubmit(submit)}
                actionLabel="Yes, Add"
                isLoading={form.formState.isSubmitting}
                loadingText="Adding..."
            />

        </AppForm>
    )
}