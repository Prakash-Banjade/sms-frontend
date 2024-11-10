import { z } from "zod";

export const studentMarkSchema = z.object({
    examSubjectId: z.string().uuid({ message: "Select exam subject" }).optional(),
    obtainedMarks: z.coerce.number().min(1, { message: "Obtained marks must be greater than 0" }).optional(),
})

export const examEvaluationSchema = z.object({
    isChecked: z.boolean(),
    studentId: z.string().uuid({ message: "Select student" }).optional(),
    marks: z.array(studentMarkSchema)
}).refine(data => data.isChecked ? !!data.studentId && data.marks.length > 0 : true, {
    message: "All fields must be filled for checked student",
    path: ["isChecked"],
});

export const examEvaluationsSchema = z.object({
    evaluations: z.array(examEvaluationSchema).refine((evaluations) => evaluations.some((evaluation) => evaluation.isChecked), {
        message: "At least one student must be evaluated",
    }),
});

export type TExamEvaluationsSchema = z.infer<typeof examEvaluationsSchema>;