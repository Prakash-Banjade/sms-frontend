import { z } from "zod";
import { teacherFormDefaultValues, teacherSchema } from "./teacher.schema";
import { EStaff } from "@/types/global.type";

export const staffSchema = teacherSchema.extend({
    teacherId: z.undefined(), // Remove `teacherId` from the schema
    type: z.nativeEnum(EStaff, {
        required_error: 'Staff type is required',
    }),
});

export type staffSchemaType = z.infer<typeof staffSchema>;

export const staffFormDefaultValues: Partial<staffSchemaType> = {
    ...teacherFormDefaultValues,
    teacherId: undefined,
    type: undefined,
}