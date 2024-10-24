import { z } from 'zod';

export const LeaveRequestSchema = z.object({
    leaveFrom: z.string({ required_error: "Leave from date is required" }).min(10, { message: "Leave from date is required" }).transform((value) => new Date(value).toISOString()),

    leaveTo: z.string({ required_error: "Leave to date is required" }).min(10, { message: "Leave to date  is required" }).transform((value) => new Date(value).toISOString()),

    title: z
        .string()
        .min(1, { message: 'Title is required' }),

    description: z
        .string()
        .min(1, { message: 'Description is required' }),

    accountId: z
        .string()
        .uuid({ message: 'Invalid UUID format' })
        .optional(),
}).refine((data) => new Date(data.leaveFrom) < new Date(data.leaveTo), {
    message: "Leave from date cannot be greater than leave to date",
    path: ["leaveFrom"],
});


export type leaveRequestSchemaType = z.infer<typeof LeaveRequestSchema>;
export const leaveRequestDefaultValues: Partial<leaveRequestSchemaType> = {
    leaveFrom: "",
    leaveTo: "",
    title: "",
    description: ''


}