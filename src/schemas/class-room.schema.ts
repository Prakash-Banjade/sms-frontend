import { EClassType } from "@/types/global.type";
import { z } from "zod";

export const classRoomFormSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().max(500, { message: "Description is too long. Max 500 characters." }).nullish(),
    admissionFee: z.coerce.number().nonnegative({ message: 'Admission fee must be a positive number' }).refine(value => value >= 0, {
        message: 'Admission fee is required',
    }),
    monthlyFee: z.coerce.number().nonnegative({ message: 'Monthly fee must be a positive number' }).refine(value => value >= 0, {
        message: 'Monthly fee is required',
    }),
    location: z.string().optional(),
    classType: z.nativeEnum(EClassType).default(EClassType.PRIMARY).optional(),
    classTeacherId: z.string()
        .transform((val) => (val === '' ? undefined : val))
        .refine((val) => val === undefined || z.string().uuid().safeParse(val).success, {
            message: 'Invalid class teacher ID',
        })
        .nullish(),
});

export const classRoomFormDefaultValues: Partial<classRoomFormSchemaType> = {
    name: "",
    location: "",
    description: "",
    monthlyFee: 0,
    admissionFee: 0,
}

export type classRoomFormSchemaType = z.infer<typeof classRoomFormSchema>;