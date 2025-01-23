import { z } from "zod";
import { teacherFormDefaultValues, teacherSchema } from "./teacher.schema";
import { EStaff } from "@/types/global.type";

export const staffSchema = teacherSchema.extend({
    type: z.nativeEnum(EStaff, {
        required_error: 'Staff type is required',
    }),
});

export type staffSchemaType = z.infer<typeof staffSchema>;

export const staffFormDefaultValues: Partial<staffSchemaType> = {
    ...teacherFormDefaultValues,
    type: undefined,
}