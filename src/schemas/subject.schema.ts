import { z } from "zod";

export const subjectFormSchema = z.object({
    subjectName: z.string().min(1, { message: 'Subject name is required' }),
    subjectCode: z.string().min(1, { message: 'Subject code is required' }),
    content: z.string().min(1, { message: 'Content description is required' }),
    theoryPM: z.coerce.number().int({ message: 'Theory pass marks must be an integer' }).positive({ message: 'Theory pass marks are required' }),
    theoryFM: z.coerce.number().int({ message: 'Theory full marks must be an integer' }).positive({ message: 'Theory full marks are required' }),
    practicalPM: z.coerce.number().int({ message: 'Practical pass marks must be an integer' }).positive({ message: 'Practical pass marks are required' }),
    practicalFM: z.coerce.number().int({ message: 'Practical full marks must be an integer' }).positive({ message: 'Practical full marks are required' }),
    classRoomId: z.string().uuid({ message: 'Class room ID must be a valid UUID' }).nullish(),
    teacherId: z.string().uuid({ message: 'Teacher ID must be a valid UUID' }).nullish(),
});

export type subjectFormSchemaType = z.infer<typeof subjectFormSchema>;

export const subjectFormDefaultValues: Partial<subjectFormSchemaType> = {
    subjectName: "",
    content: "",
};