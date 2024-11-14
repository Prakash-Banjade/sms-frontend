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

})
    // .refine((data) => {
    //     const leaveFromDate = new Date(data.leaveFrom);
    //     const leaveToDate = new Date(data.leaveTo);
    //     const today = new Date();

    //     // Ensure leaveFrom and leaveTo are not in the past
    //     if (leaveFromDate < today || leaveToDate < today) {
    //         return false;
    //     }
    //     return true;
    // }, {
    //     message: "Leave dates cannot be in the past",
    //     path: ["leaveFrom", "leaveTo"]
    // })
    .refine((data) => new Date(data.leaveFrom) <= new Date(data.leaveTo), {
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