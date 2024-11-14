import AppForm from '@/components/forms/app-form';
import { NUMBER_REGEX_STRING } from '@/CONSTANTS';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from '@/components/ui/input';
import { useEffect, useMemo, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Check } from 'lucide-react';
import { useAppMutation } from '@/hooks/useAppMutation';
import LoadingButton from '@/components/forms/loading-button';
import _ from 'lodash';
import { TExamStudent, TExamSubject } from '@/types/examination.type';
import { examEvaluationsSchema, TExamEvaluationsSchema } from '@/apps/admin/schemas/exam-evaluation.schema';
import toast from 'react-hot-toast';
import { QueryKey } from '@/react-query/queryKeys';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useGetExamReports } from '../data-access';
import { createQueryString } from '@/utils/create-query-string';
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
import { ESubjectType } from '@/types/global.type';

type Props = {
    examSubjects: TExamSubject[];
    students: TExamStudent[];
}

export default function ExamEvaluationForm({ examSubjects, students }: Props) {
    const [selectAll, setSelectAll] = useState(false); // used to track the checked subjects
    const [selectedSubjectId, setSelectedSubjectId] = useState<string | undefined>(examSubjects[0]?.id); // used to keep track of the selected subject, this is used to refetch the exam reports

    // fetch exam reports based on the exam subject to keep the default values
    const { data: reports, isLoading } = useGetExamReports({
        queryString: createQueryString({
            examSubjectId: selectedSubjectId,
            skipPagination: 'true',
        }),
        options: { enabled: !!selectedSubjectId }
    });

    // dynamically creating the default values for the form based on the subjects
    const examEvaluationDefaultValues: Partial<TExamEvaluationsSchema> = useMemo(() => {
        return ({
            evaluations: students.map(student => {
                return ({
                    isChecked: false,
                    studentId: student.id,
                    obtainedMarks: undefined,
                })
            }),
            examSubjectId: examSubjects[0]?.id,
        })
    }, [students]);

    const form = useForm<TExamEvaluationsSchema>({
        resolver: zodResolver(examEvaluationsSchema),
        defaultValues: examEvaluationDefaultValues,
    });

    useEffect(() => {
        if (reports?.data && students.length) {
            form.reset({
                ...form.getValues(),
                evaluations: students.map(student => {
                    const foundReport = reports.data.find(report => report.student?.id === student.id);

                    return {
                        reportId: foundReport?.id,
                        isChecked: !!foundReport,
                        studentId: student.id,
                        obtainedMarks: foundReport?.obtainedMarks || undefined
                    }
                })

            });

            if (reports.data.length === students.length) setSelectAll(true);
        }

    }, [students, reports])

    const { fields, update } = useFieldArray({
        name: "evaluations",
        control: form.control,
    });

    const { mutateAsync, isPending } = useAppMutation<any, { message: string }>();

    async function onSubmit(values: TExamEvaluationsSchema) {
        const updatedValues = _.differenceWith(values.evaluations, form.formState.defaultValues?.evaluations ?? [], _.isEqual);

        if (updatedValues.length === 0) return toast.error('No changes detected');

        await mutateAsync({
            endpoint: QueryKey.EXAM_REPORTS,
            method: 'patch', // always patch request
            data: {
                evaluations: updatedValues.filter(subject => subject.isChecked),
                examSubjectId: values.examSubjectId
            },
            invalidateTags: [QueryKey.EXAM_REPORTS],
        })
    }

    const handleSelectAll = (checked: boolean) => {
        setSelectAll(checked)
        fields.forEach((_, index) => {
            update(index, { ...form.getValues(`evaluations.${index}`), isChecked: checked })
        })
    }

    if (isLoading) return <div>Loading...</div>;

    return (
        <AppForm schema={examEvaluationsSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="" aria-disabled={isPending || isLoading}>
                <div className='rounded-md border overflow-hidden'>
                    <Table>
                        <TableHeader>
                            <TableRow className='bg-tableheader/50'>
                                <TableHead colSpan={3} className='min-w-36 text-center border-r text-base'>Students</TableHead>
                                <TableHead colSpan={examSubjects?.length ?? 0} className='min-w-36 text-center text-base'>
                                    <ExanSubjectSelect examSubjects={examSubjects} setSelectedSubjectId={setSelectedSubjectId} />
                                </TableHead>
                            </TableRow>
                            <TableRow className='bg-tableheader'>
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={selectAll}
                                        onCheckedChange={handleSelectAll}
                                        aria-label="Select all exam subjects"
                                    />
                                </TableHead>
                                <TableHead className='min-w-36'>Roll No</TableHead>
                                <TableHead className='min-w-36 border-r'>Student Name</TableHead>
                                <TableHead className='min-w-36'>
                                    Obtained Marks&nbsp;
                                    {form.getValues("examSubjectId") && (<span>
                                        (FM:&nbsp;
                                        {
                                            examSubjects.find(subject => subject.id === form.getValues("examSubjectId"))?.fullMark
                                        })
                                    </span>)}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.map((field, index) => (
                                <TableRow key={field.id}>
                                    <TableCell>
                                        <FormField
                                            control={form.control}
                                            name={`evaluations.${index}.isChecked`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={(checked) => {
                                                                field.onChange(checked)
                                                                update(index, { ...form.getValues(`evaluations.${index}`), isChecked: !!checked })
                                                                setSelectAll(form.getValues("evaluations").every((subject) => subject.isChecked))
                                                            }}
                                                            disabled={isPending || isLoading}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell className="w-[100px]">{students[index]?.rollNo}</TableCell>
                                    <TableCell className='border-r'>{students[index]?.fullName}</TableCell>
                                    <TableCell>
                                        <FormField
                                            control={form.control}
                                            name={`evaluations.${index}.obtainedMarks`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            pattern={NUMBER_REGEX_STRING}
                                                            type='number'
                                                            min={1}
                                                            step={0.01}
                                                            required
                                                            value={field.value ?? ''}
                                                            disabled={!form.getValues(`evaluations.${index}.isChecked`) || isPending || isLoading}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className='flex gap-2 items-center justify-between mt-6'>
                    <section className='flex gap-2'>
                        {
                            form.formState.errors.evaluations && <div className="text-destructive">
                                At least one student must be evaluated
                            </div>
                        }
                    </section>
                    <LoadingButton
                        isLoading={isPending}
                        className='ml-auto'
                        loadingText={'Submitting...'}
                        disabled={_.differenceWith(form.watch('evaluations'), form.formState.defaultValues?.evaluations ?? [], _.isEqual).length === 0 || isLoading}
                    >
                        <Check />
                        Submit
                    </LoadingButton>
                </div>
            </form>

        </AppForm>
    )
}

function ExanSubjectSelect({
    examSubjects,
    setSelectedSubjectId
}: {
    examSubjects: TExamSubject[],
    setSelectedSubjectId: React.Dispatch<React.SetStateAction<string | undefined>>
}) {
    const { setSearchParams } = useCustomSearchParams();
    const form = useFormContext<TExamEvaluationsSchema>();

    return (
        <FormField
            control={form.control}
            name="examSubjectId"
            render={({ field }) => (
                <FormItem>
                    <Select
                        onValueChange={val => {
                            const selectedSubject = examSubjects.find(subject => subject.id === val)?.subject;
                            setSearchParams('optionalSubjectId', selectedSubject?.type === ESubjectType.Optional ? selectedSubject.id : undefined);
                            setSelectedSubjectId(val)
                            field.onChange(val)

                        }}
                        defaultValue={field.value}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select exam subject" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {examSubjects.map(examSubject => (
                                <SelectItem key={examSubject.id} value={examSubject.id}>{examSubject.subject?.subjectName}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}