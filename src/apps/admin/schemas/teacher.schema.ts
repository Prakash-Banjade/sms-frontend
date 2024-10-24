import { EBloodGroup, EMaritalStatus, Gender } from "@/types/global.type";
import { z } from "zod";

export const teacherSchema = z.object({
    teacherId: z.coerce.number().optional(),

    firstName: z.string()
        .min(1, { message: 'First name is required' })
        .regex(/^[A-Za-z]+$/, { message: 'First name can only contain alphabets' }),

    lastName: z.string()
        .min(1, { message: 'Last name is required' })
        .regex(/^[A-Za-z]+$/, { message: 'Last name can only contain alphabets' })
        .optional(),

    gender: z.nativeEnum(Gender, {
        errorMap: () => ({ message: 'Invalid gender selected' })
    }),

    email: z.string().email({ message: 'Invalid email format' }),

    phone: z.string().min(10, { message: 'Seems an invalid phone number. Must be at least 10 digits' })
        .max(14, { message: "Seems an invalid phone number. Must not exceed 14 digits" }),

    dob: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid date of birth' }),

    wage: z.coerce.number().min(0, { message: 'Wage must be a positive number' }),

    profileImageId: z.string()
        .refine(val => z.string().uuid().safeParse(val).success || z.string().url().safeParse(val).success, {
            message: 'Profile image must be a valid UUID or URL'
        })
        .nullish(),

    qualification: z.string().min(1, { message: 'Qualification is required' }),

    shortDescription: z.string().max(100, { message: 'Short description must be less than 100 characters' }).nullish(),

    maritalStatus: z.nativeEnum(EMaritalStatus, {
        errorMap: () => ({ message: 'Invalid marital status' })
    }),

    bloodGroup: z.nativeEnum(EBloodGroup, {
        errorMap: () => ({ message: 'Invalid blood group' })
    }),

    joinedDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid joined date' }),

    bankName: z.string().min(1, { message: 'Bank name is required' }),

    accountName: z.string().max(50, { message: "Account name seems too long" }).min(1, { message: 'Account name is required' }),

    accountNumber: z.string().min(1, { message: 'Account number is required' }).max(50, { message: 'Account number seems too long' }),
});

export type teacherSchemaType = z.infer<typeof teacherSchema>;

export const teacherFormDefaultValues: Partial<teacherSchemaType> = {
    teacherId: undefined,
    firstName: '',
    lastName: '',
    gender: undefined,
    email: '',
    dob: '',
    wage: undefined,
    profileImageId: undefined,
    qualification: '',
    shortDescription: '',
    maritalStatus: undefined,
    bloodGroup: undefined,
    joinedDate: '',
    bankName: '',
    accountName: '',
    accountNumber: '',
}