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
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { isFuture, isToday } from 'date-fns';

type Props = {
    subjects: TSubject[];
}

const examSubjectValidationSchema = z.object({
    isChecked: z.boolean(),
    examDate: z.string()
        .refine((date) => (!isNaN(Date.parse(date)) && (isFuture(new Date(date)) || isToday(new Date(date)))), { message: "Exam date must be in the future" }),
    startTime: z.string()
        .regex(MILITARY_TIME_REGEX, { message: "Invalid start time. Time must be in format HH:MM" })
        .min(1, { message: "Start time is required" }),
    duration: z.coerce.number()
        .int({ message: "Duration must be a number" }),
    fullMark: z.coerce.number()
        .int({ message: "Full mark must be a number" })
        .min(1, { message: "Full mark must be a number greater than 0" }),
    passMark: z.coerce.number()
        .int({ message: "Pass mark must be a number" })
        .min(1, { message: "Pass mark must be a number greater than 0" }),
    venue: z.string()
        .min(1, { message: "Venue is required" }),
    subjectId: z.string({ required_error: "Subject is required" }).uuid({ message: "Invalid subject ID" }),
}).refine(data => data.fullMark >= data.passMark, {
    message: "Full mark must be greater than or equal to pass mark",
    path: ["passMark"],
});

const examSubjectSchema = z.object({
    isChecked: z.boolean(),
    examDate: z.string().optional(),
    startTime: z.string().optional(),
    duration: z.coerce.number().optional(),
    fullMark: z.coerce.number().optional(),
    passMark: z.coerce.number().optional(),
    venue: z.string().optional(),
    subjectId: z.string().optional(),
}).refine((data) => {
    if (!data.isChecked) return true
    const { success, error } = examSubjectValidationSchema.safeParse(data);
    console.log(error)

    return success;
}, {
    message: "All fields must be filled for checked subjects",
    path: ["isChecked"],
})

const examSubjectsSchema = z.object({
    examSubjects: z.array(examSubjectSchema).refine((subjects) => subjects.some((subject) => subject.isChecked), {
        message: "At least one exam subject must be checked",
    }),
})

export type TExamSubjectsSchema = z.infer<typeof examSubjectsSchema>;

export default function ExamSetupForm({ subjects }: Props) {
    const [selectAll, setSelectAll] = useState(false); // used to track the checked subjects

    const form = useForm<TExamSubjectsSchema>({
        resolver: zodResolver(examSubjectsSchema),
        defaultValues: {
            examSubjects: useMemo(() =>
                subjects.map(subject => ({
                    isChecked: false,
                    examDate: "",
                    startTime: "",
                    duration: 0,
                    fullMark: 0,
                    passMark: 0,
                    venue: "",
                    subjectId: subject.id,
                })), [subjects]),
        },
    })

    const { fields, update } = useFieldArray({
        name: "examSubjects",
        control: form.control,
    })

    function onSubmit(values: TExamSubjectsSchema) {
        console.log(values)
    }

    const handleSelectAll = (checked: boolean) => {
        setSelectAll(checked)
        fields.forEach((_, index) => {
            update(index, { ...form.getValues(`examSubjects.${index}`), isChecked: checked })
        })
    }

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
                                <TableHead>Duration</TableHead>
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
                    {
                        form.formState.errors.examSubjects && <div className="text-destructive">
                            At least one exam must be selected
                        </div>
                    }
                    <Button type="submit" className='ml-auto'>
                        <Check />
                        Create Exam
                    </Button>
                </div>
            </form>

        </AppForm>
    )
}