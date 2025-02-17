import { MILITARY_TIME_REGEX } from "@/CONSTANTS";
import { differenceInDays, isFuture } from "date-fns";
import { z } from "zod";

const examSubjectSchema = z.object({
    isChecked: z.boolean(),
    id: z.string().optional(), // used to keep the id of exam subject which is used to update the exam subject
    examDate: z.union([
        z.literal("").optional(),
        z.string()
            .refine((date) => (
                !isNaN(Date.parse(date))
                && (isFuture(new Date(date)))
                && differenceInDays(new Date(date), new Date()) <= 90
            ),
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
    theoryFM: z.union([
        z.literal("").optional(),
        z.coerce.number()
            .int({ message: "Full mark must be a number" })
            .min(1, { message: "Full mark must be greater than 0" })
    ]).optional(),
    theoryPM: z.union([
        z.literal("").optional(),
        z.coerce.number()
            .int({ message: "Pass mark must be a number" })
            .min(1, { message: "Pass mark must be greater than 0" })
    ]).optional(),
    practicalFM: z.union([
        z.literal("").optional(),
        z.coerce.number()
            .int({ message: "Full mark must be a number" })
            .min(0, { message: "Full mark must be greater or equal to 0" })
    ]).optional(),
    practicalPM: z.union([
        z.literal("").optional(),
        z.coerce.number()
            .int({ message: "Pass mark must be a number" })
            .min(0, { message: "Pass mark must be greater or equal to 0" })
    ]).optional(),
    venue: z.union([
        z.literal("").optional(),
        z.string().min(1, { message: "Venue is required" })
    ]).optional(),
    subjectId: z.union([
        z.literal("").optional(),
        z.string({ required_error: "Subject is required" }).uuid({ message: "Invalid subject ID" })
    ]).optional(),
}).refine(data => data.isChecked ? !!data.subjectId && !!data.examDate && !!data.startTime && !!data.duration && !!data.theoryFM && !!data.theoryPM : true, {
    message: "All fields must be filled for checked subjects",
    path: ["isChecked"],
}).refine(data => (data.theoryPM && data.theoryFM) ? data.theoryPM <= data.theoryFM : true, {
    message: "Pass mark must not be greater than full mark",
    path: ["theoryPM"],
}).refine(data => (data.practicalPM && data.practicalFM) ? data.practicalPM <= data.practicalFM : true, {
    message: "Pass mark must not be greater than full mark",
    path: ["practicalPM"],
})

export const examSubjectsSchema = z.object({
    examSubjects: z.array(examSubjectSchema).refine((subjects) => subjects.some((subject) => subject.isChecked), {
        message: "At least one exam subject must be checked",
    }),
});

export type TExamSubjectsSchema = z.infer<typeof examSubjectsSchema>;