import { z } from "zod";
import { teacherFormDefaultValues, teacherSchema } from "./teacher.schema";
import { EStaff } from "@/types/global.type";

export const staffSchema = teacherSchema.extend({
    teacherId: z.undefined(), // Remove `teacherId` from the schema
    staffId: z.coerce.number().optional(),
    type: z.nativeEnum(EStaff, {
        errorMap: () => ({ message: 'Invalid staff type selected' }),
    }),
});

export type staffSchemaType = z.infer<typeof staffSchema>;

export const staffFormDefaultValues: Partial<staffSchemaType> = {
    ...teacherFormDefaultValues,
    teacherId: undefined,
    staffId: undefined,
    type: undefined,
}