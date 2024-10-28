import { EDayOfWeek, ERoutineType } from "@/types/global.type";
import { z } from "zod";

export const classRoutineSchema = z.object({
    dayOfTheWeek: z.nativeEnum(EDayOfWeek, {
        errorMap: () => ({ message: 'Select a valid day' }),
    }),
    startTime: z.string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Invalid start time. Required format: HH:MM' }),
    endTime: z.string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Invalid end time. Required format: HH:MM' }),
    type: z.nativeEnum(ERoutineType, {
        errorMap: () => ({ message: 'Invalid routine type' }),
    }),
    classRoomId: z.string()
        .uuid({ message: 'Invalid class room ID. Must be a valid UUID' }),
    sectionId: z.string()
        .uuid({ message: 'Invalid class section ID. Must be a valid UUID' })
        .optional(),
    subjectId: z.string()
        .uuid({ message: 'Invalid subject ID. Must be a valid UUID' })
        .optional()
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