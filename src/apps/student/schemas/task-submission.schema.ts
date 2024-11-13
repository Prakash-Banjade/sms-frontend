import { z } from 'zod';

export const TaskSubmissionSchema = z.object({
    content: z
        .string()
        .min(1, { message: 'Content is required' }),
    attachmentIds: z.array(z.string()).max(5, { message: "Max 5 files" }).optional()

})

export type TaskSubmissionSchemaType = z.infer<typeof TaskSubmissionSchema>;
export const TaskSubmissionDefaultValues: Partial<TaskSubmissionSchemaType> = {
    content: '',
    attachmentIds: []

}