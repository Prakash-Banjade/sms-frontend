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
    const [selectedExamSubject, setSelectedExamSubject] = useState<TExamSubject | undefined>(examSubjects[0]); // used to keep track of the selected subject, this is used to refetch the exam reports

    // fetch exam reports based on the exam subject to keep the default values
    const { data: reports, isLoading } = useGetExamReports({
        queryString: createQueryString({
            examSubjectId: selectedExamSubject?.id,
            skipPagination: 'true',
        }),
        options: { enabled: !!selectedExamSubject?.id }
    });

    // dynamically creating the default values for the form based on the subjects
    const examEvaluationDefaultValues: Partial<TExamEvaluationsSchema> = useMemo(() => {
        return ({
            evaluations: students.map(student => {
                return ({
                    isChecked: false,
                    studentId: student.id,
                    theoryOM: selectedExamSubject ? selectedExamSubject.theoryFM === 0 ? 0 : undefined : undefined, // this is done to default set the OM if the FM is = 0
                    practicalOM: selectedExamSubject ? selectedExamSubject.practicalFM === 0 ? 0 : undefined : undefined, // this is done to default set the OM if the FM is = 0
                })
            }),
            examSubjectId: selectedExamSubject?.id,
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
                        theoryOM: foundReport?.theoryOM ?? (selectedExamSubject?.theoryFM === 0 ? 0 : undefined),
                        practicalOM: foundReport?.practicalOM ?? (selectedExamSubject?.practicalFM === 0 ? 0 : undefined),
                    }
                })

            });

            setSelectAll(reports.data?.length === students.length); 
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
                                    <ExanSubjectSelect examSubjects={examSubjects} setSelectedExamSubject={setSelectedExamSubject} />
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
                                    Th. Obtained Marks&nbsp;
                                    {form.getValues("examSubjectId") && (<span>
                                        (FM:&nbsp;
                                        {
                                            examSubjects.find(subject => subject.id === form.getValues("examSubjectId"))?.theoryFM
                                        })
                                    </span>)}
                                </TableHead>
                                <TableHead className='min-w-36'>
                                    Pr. Obtained Marks&nbsp;
                                    {form.getValues("examSubjectId") && (<span>
                                        (FM:&nbsp;
                                        {
                                            examSubjects.find(subject => subject.id === form.getValues("examSubjectId"))?.practicalFM
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
                                            name={`evaluations.${index}.theoryOM`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            pattern={NUMBER_REGEX_STRING}
                                                            type='number'
                                                            min={0}
                                                            max={selectedExamSubject?.theoryFM}
                                                            step={0.01}
                                                            required
                                                            value={field.value ?? ''}
                                                            disabled={
                                                                !form.getValues(`evaluations.${index}.isChecked`)
                                                                || isPending
                                                                || isLoading
                                                                || selectedExamSubject?.theoryFM === 0
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <FormField
                                            control={form.control}
                                            name={`evaluations.${index}.practicalOM`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            pattern={NUMBER_REGEX_STRING}
                                                            type='number'
                                                            min={0}
                                                            max={selectedExamSubject?.practicalFM}
                                                            step={0.01}
                                                            required
                                                            value={field.value ?? ''}
                                                            disabled={
                                                                !form.getValues(`evaluations.${index}.isChecked`)
                                                                || isPending
                                                                || isLoading
                                                                || selectedExamSubject?.practicalFM === 0
                                                            }
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
    setSelectedExamSubject
}: {
    examSubjects: TExamSubject[],
    setSelectedExamSubject: React.Dispatch<React.SetStateAction<TExamSubject | undefined>>
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
                            const foundExamSubject = examSubjects.find(subject => subject.id === val);
                            const selectedSubject = foundExamSubject?.subject;
                            setSearchParams('optionalSubjectId', selectedSubject?.type === ESubjectType.Optional ? selectedSubject.id : undefined);
                            setSelectedExamSubject(foundExamSubject)
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