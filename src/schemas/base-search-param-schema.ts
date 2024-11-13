import { z } from "zod";

export const baseSearchParamSchema = z.object({
    search: z.string().optional(),
    page: z.string().transform((value) => parseInt(value)).refine((value) => value > 0, { message: 'Page must be greater than 0' }).optional(),
    take: z.string().transform((value) => parseInt(value)).refine((value) => (value > 0 && value <= 50), { message: 'Take must be between 1 and 50' }).optional(),
})