import AppForm from '@/components/forms/app-form';
import { NUMBER_REGEX_STRING } from '@/CONSTANTS';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from '@/components/ui/input';
import { useMemo, useState } from 'react';
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

type Props = {
    examSubjects: TExamSubject[];
    students: TExamStudent[];
} & ({
    defaultValues: TExamEvaluationsSchema;
} | {
    defaultValues?: undefined
})

export default function ExamEvaluationForm({ examSubjects, students, defaultValues }: Props) {
    const [selectAll, setSelectAll] = useState(defaultValues?.evaluations?.every(evaluation => evaluation.isChecked)); // used to track the checked subjects

    // dynamically creating the default values for the form based on the subjects
    const examEvaluationDefaultValues: Partial<TExamEvaluationsSchema> = useMemo(() => {
        return ({
            evaluations: students.flatMap(student => {
                return ({
                    isChecked: false,
                    studentId: student.id,
                    obtainedMarks: undefined,
                })
            }),
            examSubjectId: undefined,
        })
    }, [students]);

    const form = useForm<TExamEvaluationsSchema>({
        resolver: zodResolver(examEvaluationsSchema),
        defaultValues: examEvaluationDefaultValues,
    });

    const { fields, update } = useFieldArray({
        name: "evaluations",
        control: form.control,
    });

    const { mutateAsync, isPending } = useAppMutation<any, { message: string }>()

    async function onSubmit(values: TExamEvaluationsSchema) {
        const updatedValues = _.differenceWith(values.evaluations, form.formState.defaultValues?.evaluations ?? [], _.isEqual);

        if (updatedValues.length === 0) return toast.error('No changes detected');

        await mutateAsync({
            endpoint: QueryKey.EXAM_REPORTS,
            method: defaultValues ? 'patch' : 'post',
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

    return (
        <AppForm schema={examEvaluationsSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
                <div className='rounded-md border overflow-hidden'>
                    <Table>
                        <TableHeader>
                            <TableRow className='bg-tableheader/50'>
                                <TableHead colSpan={3} className='min-w-36 text-center border-r text-base'>Students</TableHead>
                                <TableHead colSpan={examSubjects?.length ?? 0} className='min-w-36 text-center text-base'>
                                    <ExanSubjectSelect examSubjects={examSubjects} />
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
                                                            min={10}
                                                            required
                                                            value={field.value ?? ''}
                                                            disabled={!form.getValues(`evaluations.${index}.isChecked`)}
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
                        loadingText={!!defaultValues ? 'Updating changes...' : 'Submitting...'}
                        disabled={_.differenceWith(form.watch('evaluations'), form.formState.defaultValues?.evaluations ?? [], _.isEqual).length === 0}
                    >
                        <Check />
                        {
                            !!defaultValues ? 'Update Changes' : 'Submit'
                        }
                    </LoadingButton>
                </div>
            </form>

        </AppForm>
    )
}

function ExanSubjectSelect({ examSubjects }: { examSubjects: TExamSubject[] }) {
    const form = useFormContext<TExamEvaluationsSchema>();

    return (
        <FormField
            control={form.control}
            name="examSubjectId"
            render={({ field }) => (
                <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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