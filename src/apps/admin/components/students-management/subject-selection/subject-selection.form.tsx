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
    optionalSubjectId: z.string().optional(),
    isChecked: z.boolean().optional(),
    subjectId: z.string().uuid({ message: 'Subject ID is required' }),
    studentId: z.string({ required_error: 'Student ID is required' }).uuid({ message: 'Invalid student ID' }),
})

const subjectSelectionsSchema = z.object({
    selections: z.array(subjectSelectionSchema).min(1, { message: 'At least one subject selection is required' }),
})

type TSubjectSelectionsSchema = z.infer<typeof subjectSelectionsSchema>;

export default function SubjectSelectionForm({ students, subjects, studentsMeta }: Props) {
    const formDefaultValue: TSubjectSelectionsSchema = useMemo(() => {
        return {
            selections: students.flatMap(student => {
                return subjects.map(subject => ({
                    optionalSubjectId: subject.id,
                    studentId: student.id,
                    isChecked: subject.studentIds?.includes(student.id),
                    subjectId: subject.subjectId,
                }))
            })
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

    function handleCheckboxChange(studentId: string, subjectId: string, checked: boolean) {
        const foundSubjectSelectionIndex = selectionsField.findIndex(field => field.studentId === studentId && field.subjectId === subjectId);
        if (foundSubjectSelectionIndex !== -1) {
            form.setValue(`selections.${foundSubjectSelectionIndex}.isChecked`, checked);
        }
    }

    const { mutateAsync, isPending } = useAppMutation();

    async function onSubmit(values: TSubjectSelectionsSchema) {
        const updatedValues = _.differenceWith(values.selections, (formDefaultValue?.selections || []), _.isEqual);
        if (!updatedValues.length) return toast.error('No changes detected');

        const groupedData = _.groupBy(updatedValues, 'optionalSubjectId');

        const selections = Object.entries(groupedData).map(([key, value]) => {
            return {
                optionalSubjectId: key,
                studentIds: value.map(selection => ({
                    id: selection.studentId,
                    isChecked: selection.isChecked,
                }))
            }
        })

        await mutateAsync({
            endpoint: QueryKey.OPTIONAL_SUBJECTS,
            method: 'patch', // always patch
            data: { selections },
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
                                                name={`selections.${subjectIndex}.isChecked`}
                                                render={() => (
                                                    <FormItem className="w-fit">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={form.watch('selections')?.find(selection => selection.studentId === student.id && selection.subjectId === subject.subjectId)?.isChecked}
                                                                onCheckedChange={(checked) => {
                                                                    handleCheckboxChange(student.id, subject.subjectId, !!checked);
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