import { MILITARY_TIME_REGEX } from "@/CONSTANTS";
import { EDayOfWeek, ERoutineType } from "@/types/global.type";
import { z } from "zod";
import { differenceInMinutes, isAfter, parse } from "date-fns";

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
        .refine((val) => val === undefined || z.string().uuid().safeParse(val).success, {
            message: 'Invalid class room ID',
        }),
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
        }).nullish(),
    teacherId: z.string()
        .transform((val) => (val === '' ? undefined : val))
        .refine((val) => val === undefined || z.string().uuid().safeParse(val).success, {
            message: 'Invalid teacher ID',
        }).nullish(),
}).refine(data => {
    const startTime = parse(data.startTime, 'HH:mm', new Date());
    const endTime = parse(data.endTime, 'HH:mm', new Date());
    return isAfter(endTime, startTime);
}, {
    message: 'End time must be greater than start time',
    path: ['endTime'],
}).refine(data => {
    const startTime = parse(data.startTime, 'HH:mm', new Date());
    const endTime = parse(data.endTime, 'HH:mm', new Date());
    return differenceInMinutes(endTime, startTime) >= 10;
}, {
    message: 'Class routine must be at least 10 minutes long',
    path: ['endTime'],
})

export type classRoutineSchemaType = z.infer<typeof classRoutineSchema>;

export const classRoutineDefaultValues: Partial<classRoutineSchemaType> = {
    type: ERoutineType.CLASS,
    startTime: "",
    endTime: "",
    classRoomId: "",
    subjectId: "",
    teacherId: "",
}