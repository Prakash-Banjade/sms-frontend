import AppForm from '@/components/forms/app-form';
import { MILITARY_TIME_REGEX, NUMBER_REGEX_STRING } from '@/CONSTANTS';
import { TSubject } from '@/types/subject.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from '@/components/ui/input';
import { useMemo, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Check } from 'lucide-react';
import { isFuture, isToday } from 'date-fns';
import { useAppMutation } from '@/hooks/useAppMutation';
import { QueryKey } from '@/react-query/queryKeys';
import LoadingButton from '@/components/forms/loading-button';

type Props = {
    subjects: TSubject[];
    searchQuery: string;
} & ({
    examId: string;
} | {
    examId?: undefined
})

const examSubjectSchema = z.object({
    isChecked: z.boolean(),
    examDate: z.union([
        z.literal("").optional(),
        z.string()
            .refine((date) => (!isNaN(Date.parse(date)) && (isFuture(new Date(date)) || isToday(new Date(date)))),
                { message: "Exam date must be in the future" })
    ]).optional(),
    startTime: z.union([
        z.literal("").optional(),
        z.string()
            .regex(MILITARY_TIME_REGEX, { message: "Invalid start time. Time must be in format HH:MM" })
            .min(1, { message: "Start time is required" })
    ]).optional(),
    duration: z.union([
        z.literal("").optional(),
        z.coerce.number()
            .int({ message: "Duration must be a number" })
            .min(1, { message: "Duration must be greater than 0" })
    ]).optional(),
    fullMark: z.union([
        z.literal("").optional(),
        z.coerce.number()
            .int({ message: "Full mark must be a number" })
            .min(1, { message: "Full mark must be greater than 0" })
    ]).optional(),
    passMark: z.union([
        z.literal("").optional(),
        z.coerce.number()
            .int({ message: "Pass mark must be a number" })
            .min(1, { message: "Pass mark must be greater than 0" })
    ]).optional(),
    venue: z.union([
        z.literal("").optional(),
        z.string().min(1, { message: "Venue is required" })
    ]).optional(),
    subjectId: z.union([
        z.literal("").optional(),
        z.string({ required_error: "Subject is required" }).uuid({ message: "Invalid subject ID" })
    ]).optional(),
}).refine(data => data.isChecked ? !!data.subjectId && !!data.examDate && !!data.startTime && !!data.duration && !!data.fullMark && !!data.passMark && !!data.venue : true, {
    message: "All fields must be filled for checked subjects",
    path: ["isChecked"],
}).refine(data => (data.passMark && data.fullMark) ? data.passMark <= data.fullMark : true, {
    message: "Pass mark must not be greater than full mark",
    path: ["passMark"],
});

const examSubjectsSchema = z.object({
    examSubjects: z.array(examSubjectSchema).refine((subjects) => subjects.some((subject) => subject.isChecked), {
        message: "At least one exam subject must be checked",
    }),
});

export type TExamSubjectsSchema = z.infer<typeof examSubjectsSchema>;

export default function ExamSetupForm({ subjects, searchQuery, examId }: Props) {
    const [selectAll, setSelectAll] = useState(false); // used to track the checked subjects

    const { classRoomId, examTypeId, sectionId } = useMemo(() => {
        const searchParams = new URLSearchParams(searchQuery);
        return {
            classRoomId: searchParams.get('classRoomId'),
            examTypeId: searchParams.get('examTypeId'),
            sectionId: searchParams.get('sectionId'),
        }
    }, [searchQuery]);

    const form = useForm<TExamSubjectsSchema>({
        resolver: zodResolver(examSubjectsSchema),
        defaultValues: {
            examSubjects: useMemo(() =>
                subjects.map(subject => ({
                    isChecked: false,
                    examDate: "",
                    startTime: "",
                    duration: undefined,
                    fullMark: undefined,
                    passMark: undefined,
                    venue: "",
                    subjectId: subject.id,
                })), [subjects]),
        },
    })

    const { fields, update } = useFieldArray({
        name: "examSubjects",
        control: form.control,
    })

    const { mutateAsync, isPending } = useAppMutation()

    async function onSubmit(values: TExamSubjectsSchema) {
        await mutateAsync({
            endpoint: QueryKey.EXAMS,
            method: examId ? 'patch' : 'post',
            id: examId,
            data: {
                examSubjects: values.examSubjects.filter(subject => subject.isChecked),
                classRoomId: sectionId ?? classRoomId,
                examTypeId,
            },
            invalidateTags: [QueryKey.EXAMS],
        })
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
                                <TableHead>Subject Code</TableHead>
                                <TableHead>Subject Name</TableHead>
                                <TableHead>Exam Date</TableHead>
                                <TableHead>Start Time</TableHead>
                                <TableHead>Duration (Min)</TableHead>
                                <TableHead>Full Mark</TableHead>
                                <TableHead>Pass Mark</TableHead>
                                <TableHead>Venue</TableHead>
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
                                    <TableCell className="w-[100px]">{subjects[index].subjectCode}</TableCell>
                                    <TableCell>{subjects[index].subjectName}</TableCell>
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
                                                            disabled={!form.getValues(`examSubjects.${index}.isChecked`)}
                                                            min={new Date().toISOString().split("T")[0]}
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
                                            name={`examSubjects.${index}.fullMark`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            {...field}
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
                                            name={`examSubjects.${index}.passMark`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            {...field}
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
                                            name={`examSubjects.${index}.venue`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="text"
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
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className='flex gap-2 items-center justify-between mt-6'>
                    <p className='text-muted-foreground'>
                        Select subjects and fill all the details.
                    </p>

                    {
                        form.formState.errors.examSubjects && <div className="text-destructive">
                            At least one exam must be selected
                        </div>
                    }
                    <LoadingButton isLoading={isPending} className='ml-auto' loadingText='Creating exam...'>
                        <Check />
                        Create Exam
                    </LoadingButton>
                </div>
            </form>

        </AppForm>
    )
}