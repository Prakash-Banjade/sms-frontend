import { ESubjectChapterPriority } from "@/types/global.type";
import { z } from "zod";

export const subjectFormSchema = z.object({
    subjectName: z.string().min(1, { message: 'Subject name is required' }),
    subjectCode: z.string().min(1, { message: 'Subject code is required' }),
    content: z.string().min(1, { message: 'Content description is required' }),
    theoryPM: z.coerce.number().int({ message: 'Theory pass marks must be an integer' }).refine(val => val >= 0),
    theoryFM: z.coerce.number().int({ message: 'Theory full marks must be an integer' }).refine(val => val >= 0),
    practicalPM: z.coerce.number().int({ message: 'Practical pass marks must be an integer' }).refine(val => val >= 0),
    practicalFM: z.coerce.number().int({ message: 'Practical full marks must be an integer' }).refine(val => val >= 0),
    classRoomId: z.string().uuid({ message: 'Class room ID must be a valid UUID' }).nullish(),
    teacherId: z.string().uuid({ message: 'Teacher ID must be a valid UUID' }).nullish(),
});

export type subjectFormSchemaType = z.infer<typeof subjectFormSchema>;

export const subjectFormDefaultValues: Partial<subjectFormSchemaType> = {
    subjectName: "",
    content: "",
    subjectCode: "",
};

export const subjectChapterSchema = z.object({
    title: z.string().min(1, { message: 'Chapter title is required' }),
    content: z.string().min(100, { message: 'Content is too small. Minimum 100 characters.' })
        .max(1000, { message: 'Content is too long. Maximum 1000 characters.' }),
    priority: z.nativeEnum(ESubjectChapterPriority),
    subjectId: z.string().uuid({ message: 'Subject ID must be a valid UUID' })
});

export type subjectChapterSchemaType = z.infer<typeof subjectChapterSchema>;

export const subjectChapterFormDefaultValues: Partial<subjectChapterSchemaType> = {
    title: "",
    content: "",
    priority: ESubjectChapterPriority.MEDIUM,
};