import AppForm from '@/components/forms/app-form';
import { ISO_TIME, NUMBER_REGEX_STRING } from '@/CONSTANTS';
import { TSubject } from '@/apps/admin/types/subject.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from '@/components/ui/input';
import { useEffect, useMemo, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Check } from 'lucide-react';
import { useAppMutation } from '@/hooks/useAppMutation';
import { QueryKey } from '@/react-query/queryKeys';
import LoadingButton from '@/components/forms/loading-button';
import { examSubjectsSchema, TExamSubjectsSchema } from '@/apps/admin/schemas/exam-setup.schema';
import _ from 'lodash';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-provider';
import { addDays } from 'date-fns';
import { formatDateNumeric } from '@/utils/format-date';

type Props = {
    subjects: TSubject[];
} & ({
    examId: string;
    defaultValues: TExamSubjectsSchema;
} | {
    examId?: undefined
    defaultValues?: undefined
})

export default function ExamSetupForm({ subjects, examId, defaultValues }: Props) {
    const [searchParams] = useSearchParams();
    const { payload } = useAuth();

    const [selectAll, setSelectAll] = useState(defaultValues?.examSubjects?.every(subject => subject.isChecked)); // used to track the checked subjects

    const { classRoomId, examTypeId } = useMemo(() => {
        return {
            classRoomId: searchParams.get('classRoomId'),
            examTypeId: searchParams.get('examTypeId'),
        }
    }, [searchParams]);

    const navigate = useNavigate();

    // dynamically creating the default values for the form based on the subjects
    const examFormDefaultValues = useMemo(() => {
        return ({
            examSubjects: subjects.map(subject => ({
                isChecked: false,
                examDate: "",
                startTime: "",
                duration: undefined,
                theoryFM: subject.theoryFM,
                theoryPM: subject.theoryPM,
                practicalFM: subject.practicalFM,
                practicalPM: subject.practicalPM,
                venue: "",
                subjectId: subject.id,
            }))
        })
    }, [subjects])

    const form = useForm<TExamSubjectsSchema>({
        resolver: zodResolver(examSubjectsSchema),
        defaultValues: defaultValues ?? examFormDefaultValues,
    });

    useEffect(() => {
        form.reset(examId ? defaultValues : examFormDefaultValues);
    }, [subjects]);

    const { fields, update } = useFieldArray({
        name: "examSubjects",
        control: form.control,
    })

    const { mutateAsync, isPending } = useAppMutation<any, { message: string }>();

    async function onSubmit(values: TExamSubjectsSchema) {
        if (_.differenceWith(values.examSubjects, form.formState.defaultValues?.examSubjects ?? [], _.isEqual).length === 0) return toast.error('No changes detected');

        const response = await mutateAsync({
            endpoint: QueryKey.EXAMS,
            method: examId ? 'patch' : 'post',
            id: examId,
            data: {
                examSubjects: values.examSubjects.filter(subject => subject.isChecked),
                classRoomId,
                examTypeId,
            },
            invalidateTags: [QueryKey.EXAMS],
        })

        if (response?.data?.message) {
            navigate(`/${payload?.role}/examination/exam-setup`)
        }
    }

    const handleSelectAll = (checked: boolean) => {
        setSelectAll(checked)
        fields.forEach((_, index) => {
            update(index, { ...form.getValues(`examSubjects.${index}`), isChecked: checked })
        })
    }

    // if no class or exam type is selected, show the message
    if (!classRoomId || !examTypeId) return (
        <section className="text-muted-foreground min-h-[300px] grid place-items-center text-center">
            Select exam type and class
        </section>
    );

    return (
        <AppForm schema={examSubjectsSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
                <div className='rounded-md border overflow-hidden'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={selectAll}
                                        onCheckedChange={handleSelectAll}
                                        aria-label="Select all exam subjects"
                                    />
                                </TableHead>
                                <TableHead className='min-w-36'>Subject Code</TableHead>
                                <TableHead className='min-w-36'>Subject Name</TableHead>
                                <TableHead className='min-w-36'>Exam Date</TableHead>
                                <TableHead className='min-w-36'>Start Time</TableHead>
                                <TableHead className='min-w-36'>Duration (Min)</TableHead>
                                <TableHead className='min-w-36'>Th. Full Mark</TableHead>
                                <TableHead className='min-w-36'>Th. Pass Mark</TableHead>
                                <TableHead className='min-w-36'>Pr. Full Mark</TableHead>
                                <TableHead className='min-w-36'>Pr. Pass Mark</TableHead>
                                <TableHead className='min-w-36'>Venue</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.map((field, index) => (
                                <TableRow key={field.id}>
                                    <TableCell>
                                        <FormField
                                            control={form.control}
                                            name={`examSubjects.${index}.isChecked`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={(checked) => {
                                                                field.onChange(checked)
                                                                update(index, { ...form.getValues(`examSubjects.${index}`), isChecked: !!checked })
                                                                setSelectAll(form.getValues("examSubjects").every((subject) => subject.isChecked))
                                                            }}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell className="w-[100px]">{subjects[index]?.subjectCode}</TableCell>
                                    <TableCell>{subjects[index]?.subjectName}</TableCell>
                                    <TableCell>
                                        <FormField
                                            control={form.control}
                                            name={`examSubjects.${index}.examDate`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="date"
                                                            {...field}
                                                            required
                                                            value={!!field.value ? formatDateNumeric({ date: new Date(field.value) }) : ''}
                                                            onChange={e => {
                                                                const val = e.target.value;

                                                                if (val) {
                                                                    field.onChange(val + ISO_TIME);
                                                                } else {
                                                                    field.onChange('');
                                                                }
                                                            }}
                                                            disabled={!form.getValues(`examSubjects.${index}.isChecked`)}
                                                            min={addDays(new Date(), 1).toISOString().split("T")[0]}
                                                            max={addDays(new Date(), 90).toISOString().split("T")[0]}
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
                                            name={`examSubjects.${index}.startTime`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="time"
                                                            {...field}
                                                            required
                                                            disabled={!form.getValues(`examSubjects.${index}.isChecked`)}
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
                                            name={`examSubjects.${index}.duration`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                            min={1}
                                                            required
                                                            pattern={NUMBER_REGEX_STRING}
                                                            disabled={!form.getValues(`examSubjects.${index}.isChecked`)}
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
                                            name={`examSubjects.${index}.theoryFM`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                            min={1}
                                                            required
                                                            pattern={NUMBER_REGEX_STRING}
                                                            disabled={!form.getValues(`examSubjects.${index}.isChecked`)}
                                                            max={subjects[index]?.theoryFM}
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
                                            name={`examSubjects.${index}.theoryPM`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                            min={1}
                                                            required
                                                            pattern={NUMBER_REGEX_STRING}
                                                            disabled={!form.getValues(`examSubjects.${index}.isChecked`)}
                                                            max={subjects[index]?.theoryPM}
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
                                            name={`examSubjects.${index}.practicalFM`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                            min={0}
                                                            required
                                                            pattern={NUMBER_REGEX_STRING}
                                                            disabled={!form.getValues(`examSubjects.${index}.isChecked`)}
                                                            max={subjects[index]?.practicalFM}
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
                                            name={`examSubjects.${index}.practicalPM`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                            min={0}
                                                            required
                                                            pattern={NUMBER_REGEX_STRING}
                                                            disabled={!form.getValues(`examSubjects.${index}.isChecked`)}
                                                            max={subjects[index]?.practicalPM}
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
                                            name={`examSubjects.${index}.venue`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="text"
                                                            {...field}
                                                            disabled={!form.getValues(`examSubjects.${index}.isChecked`)}
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
                            !examId && <p className='text-muted-foreground'>
                                Select subjects and fill all the details.
                            </p>
                        }

                        {
                            form.formState.errors.examSubjects && <div className="text-destructive">
                                At least one exam must be selected
                            </div>
                        }
                    </section>
                    <LoadingButton
                        isLoading={isPending}
                        className='ml-auto'
                        loadingText='Creating exam...'
                        disabled={_.differenceWith(form.watch('examSubjects'), form.formState.defaultValues?.examSubjects ?? [], _.isEqual).length === 0}
                    >
                        <Check />
                        {
                            examId ? 'Update Exam' : 'Create Exam'
                        }
                    </LoadingButton>
                </div>
            </form>

        </AppForm>
    )
}