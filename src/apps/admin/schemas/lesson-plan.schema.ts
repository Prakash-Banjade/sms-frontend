import { isFuture, isToday } from "date-fns";
import { z } from "zod";

export const lessonPlanSchema = z.object({
    startDate: z.string({ required_error: 'Start date is required' })
        .refine(date => !isNaN(Date.parse(date)), { message: "Invalid start date" })
        .refine(date => (isToday(date) || isFuture(date)), { message: "Start date cannot be in the past" }),
    endDate: z.string({ required_error: 'End date is required' })
        .refine(date => !isNaN(Date.parse(date)), { message: "Invalid end date" })
        .refine(date => isFuture(date), { message: "End date must be in the future" }),
    title: z.string()
        .min(1, { message: "Title is required" })
        .max(100, { message: "Title should not exceed 100 characters" }),
    description: z.string()
        .min(1, { message: "Description is required" })
        .max(500, { message: "Description should not exceed 500 characters" }),
    attachmentIds: z.array(z.string()).max(5, { message: "Max 5 files" }).optional(),
    subjectId: z.string()
        .uuid({ message: "Subject ID must be a valid UUID" }),
    sectionId: z.string({ required_error: "Section is required" })
        .uuid({ message: 'Select a section' })
        .optional(),
    facultyId: z.string({ required_error: "Faculty is required" }).uuid({ message: "Faculty ID must be a valid UUID" }),
    classRoomId: z.string({ required_error: "Class room is required" })
        .uuid({ message: 'Select a class room' }),
}).superRefine((data, ctx) => {
    if (data.startDate > data.endDate) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Start date must be before end date",
            path: ["startDate"],
        });
    }
})

export type lessonPlanSchemaType = z.infer<typeof lessonPlanSchema>;

export const lessonPlanDefaultValues: Partial<lessonPlanSchemaType> = {
    startDate: '',
    endDate: '',
    title: '',
    description: '',
    attachmentIds: [],
    subjectId: undefined,
    sectionId: undefined,
    classRoomId: undefined,
    facultyId: undefined
};