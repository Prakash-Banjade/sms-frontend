import { z } from "zod";

export const classRoomFormSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().nullish(),
    monthlyTutionFee: z.coerce.number().nonnegative({ message: 'Monthly tuition fee must be a positive number' }).refine(value => value >= 0, {
        message: 'Monthly tuition fee is required',
    }),
    monthlyFee: z.coerce.number().nonnegative({ message: 'Monthly fee must be a positive number' }).refine(value => value >= 0, {
        message: 'Monthly fee is required',
    }),
    location: z.string().optional(),
});

export const classRoomFormDefaultValues: Partial<classRoomFormSchemaType> = {
    name: "",
    location: "",
    description: "",
}

export type classRoomFormSchemaType = z.infer<typeof classRoomFormSchema>;