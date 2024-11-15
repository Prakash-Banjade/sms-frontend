import { z } from "zod";

export const examEvaluationSchema = z.object({
    isChecked: z.boolean(),
    reportId: z.string().optional(), // used to keep the id of exam report which is used to update the exam report
    studentId: z.string().uuid({ message: "Select student" }).optional(),
    theoryOM: z.coerce.number().min(1, { message: "Obtained marks must be greater than 0" }).optional(),
    practicalOM: z.coerce.number().min(1, { message: "Obtained marks must be greater than 0" }).optional(),
}).refine(data => data.isChecked ? (!!data.studentId && data.theoryOM !== undefined && data.practicalOM !== undefined) : true, {
    message: "All fields must be filled for checked student",
    path: ["isChecked"],
});

export const examEvaluationsSchema = z.object({
    evaluations: z.array(examEvaluationSchema).refine((evaluations) => evaluations.some((evaluation) => evaluation.isChecked), {
        message: "At least one student must be evaluated",
    }),
    examSubjectId: z.string({ required_error: "Please select a subject" }).uuid({ message: "Select a valid subject" }),
});

export type TExamEvaluationsSchema = z.infer<typeof examEvaluationsSchema>;