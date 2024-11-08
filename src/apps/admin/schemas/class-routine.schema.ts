import { MILITARY_TIME_REGEX } from "@/CONSTANTS";
import { EDayOfWeek, ERoutineType } from "@/types/global.type";
import { z } from "zod";

export const classRoutineSchema = z.object({
    dayOfTheWeek: z.nativeEnum(EDayOfWeek, {
        errorMap: () => ({ message: 'Select a valid day' }),
    }),
    startTime: z.string()
        .regex(MILITARY_TIME_REGEX, { message: 'Invalid start time. Required format: HH:MM' }),
    endTime: z.string()
        .regex(MILITARY_TIME_REGEX, { message: 'Invalid end time. Required format: HH:MM' }),
    type: z.nativeEnum(ERoutineType, {
        errorMap: () => ({ message: 'Invalid routine type' }),
    }),
    classRoomId: z.string()
        .uuid({ message: 'Invalid class room ID. Must be a valid UUID' }),
    sectionId: z.string()
        .transform((val) => (val === '' ? undefined : val))
        .refine((val) => val === undefined || z.string().uuid().safeParse(val).success, {
            message: 'Invalid section ID',
        })
        .nullish(),
    subjectId: z.string()
        .transform((val) => (val === '' ? undefined : val))
        .refine((val) => val === undefined || z.string().uuid().safeParse(val).success, {
            message: 'Invalid subject ID',
        })
        .nullish(),
}).refine(data => data.type !== ERoutineType.CLASS || !!data.subjectId, {
    message: 'Please select a subject for class routine',
    path: ['subjectId'],
});

export type classRoutineSchemaType = z.infer<typeof classRoutineSchema>;

export const classRoutineDefaultValues: Partial<classRoutineSchemaType> = {
    type: ERoutineType.CLASS,
    startTime: "",
    endTime: "",
    classRoomId: undefined,
}