import AppForm from "@/components/forms/app-form";
import { TStudent_BasicInfo } from "@/types/student.type"
import { TOptionalSubject } from "@/types/subject.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import _ from "lodash";
import toast from "react-hot-toast";
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import LoadingButton from "@/components/forms/loading-button";
import { TMeta } from "@/types/global.type";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";

type Props = {
    students: TStudent_BasicInfo[];
    subjects: TOptionalSubject[];
    studentsMeta: TMeta,
}

const subjectSelectionSchema = z.object({
    subjectId: z.string().uuid({ message: 'Subject ID is required' }),
    studentIds: z.array(z.string({ required_error: 'Student ID is required' }).uuid({ message: 'Invalid student ID' })).default([]).optional(),
})

const subjectSelectionsSchema = z.object({
    selections: z.array(subjectSelectionSchema).min(1, { message: 'At least one subject selection is required' }),
})

type TSubjectSelectionsSchema = z.infer<typeof subjectSelectionsSchema>;

export default function SubjectSelectionForm({ students, subjects, studentsMeta }: Props) {
    const formDefaultValue = useMemo(() => {
        return {
            selections: subjects.map(subject => ({
                subjectId: subject.subjectId, // subject.id is optionalSubject id, but the actual subject id is subject.subjectId, refer backend
                studentIds: subject.studentIds,
            })),
        };
    }, [subjects]);

    const form = useForm<TSubjectSelectionsSchema>({
        resolver: zodResolver(subjectSelectionsSchema),
        defaultValues: formDefaultValue,
    });

    const { fields: selectionsField } = useFieldArray({
        name: "selections",
        control: form.control,
    });

    // Function to handle adding/removing student IDs based on checkbox state
    const handleSubjectCheckboxChange = (studentId: string, subjectId: string, checked: boolean) => {
        const subjectIndex = selectionsField.findIndex(field => field.subjectId === subjectId);

        if (subjectIndex !== -1) {
            const currentStudentIds = form.getValues(`selections.${subjectIndex}.studentIds`) || [];
            const updatedStudentIds = checked
                ? [...currentStudentIds, studentId]
                : currentStudentIds.filter(id => id !== studentId);

            form.setValue(`selections.${subjectIndex}.studentIds`, updatedStudentIds);
        }
    };

    const { mutateAsync, isPending } = useAppMutation();

    async function onSubmit(values: TSubjectSelectionsSchema) {
        const updatedValues = _.differenceWith(values.selections, (formDefaultValue?.selections || []), _.isEqual);
        if (!updatedValues.length) return toast.error('No changes detected');

        await mutateAsync({
            endpoint: QueryKey.OPTIONAL_SUBJECTS,
            method: 'patch', // always patch
            data: { selections: updatedValues },
            invalidateTags: [QueryKey.OPTIONAL_SUBJECTS],
        })
    }

    return (
        <AppForm schema={subjectSelectionsSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="" aria-disabled={false}>
                <div className='rounded-md border overflow-hidden'>
                    <Table>
                        <TableHeader>
                            <TableRow className='bg-tableheader/50'>
                                <TableHead colSpan={3} className='text-center border-r text-base'>Students</TableHead>
                                <TableHead colSpan={subjects?.length ?? 0} className='text-center text-base'>Optional Subjects</TableHead>
                            </TableRow>
                            <TableRow className='bg-tableheader'>
                                <TableHead>Roll No</TableHead>
                                <TableHead>Student ID</TableHead>
                                <TableHead className='border-r'>Student Name</TableHead>
                                {subjects?.map((subject, index) => (
                                    <TableHead key={index}>{subject.subjectName}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell>{student.rollNo}</TableCell>
                                    <TableCell>{student.studentId}</TableCell>
                                    <TableCell className='border-r'>{student.fullName}</TableCell>
                                    {subjects?.map((subject, subjectIndex) => (
                                        <TableCell key={subjectIndex}>
                                            <FormField
                                                control={form.control}
                                                name={`selections.${subjectIndex}.studentIds`}
                                                render={({ field }) => (
                                                    <FormItem className="w-fit">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(student.id)}
                                                                onCheckedChange={(checked) => {
                                                                    handleSubjectCheckboxChange(student.id, subject.subjectId, !!checked);
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <DataTablePagination meta={studentsMeta} />

                <div className="flex mt-6 justify-end">
                    <LoadingButton
                        type="submit"
                        disabled={
                            _.differenceWith(form.watch('selections'), (formDefaultValue?.selections || []), _.isEqual).length === 0
                            || isPending
                        }
                        isLoading={isPending}
                        loadingText="Saving..."
                        className="min-w-40"
                    >
                        Save
                    </LoadingButton>
                </div>
            </form>
        </AppForm>
    );
}