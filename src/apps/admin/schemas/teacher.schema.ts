import { NAME_REGEX, NAME_WITH_SPACE_REGEX, PHONE_NUMBER_REGEX } from "@/CONSTANTS";
import { EBloodGroup, EMaritalStatus, Gender } from "@/types/global.type";
import { z } from "zod";

export const teacherSchema = z.object({
    firstName: z.string()
        .min(1, { message: 'First name is required' })
        .regex(NAME_REGEX, { message: 'First name can only contain alphabets' }),

    lastName: z.string()
        .min(1, { message: 'Last name is required' })
        .regex(NAME_WITH_SPACE_REGEX, { message: 'Seems like last name is invalid' })
        .optional(),

    gender: z.nativeEnum(Gender, {
        errorMap: () => ({ message: 'Invalid gender selected' })
    }),

    email: z.string().email({ message: 'Invalid email format' }),

    phone: z.string().regex(PHONE_NUMBER_REGEX, { message: "Invalid phone number" }),

    dob: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid date of birth' }),

    wage: z.coerce.number().min(0, { message: 'Wage must be a positive number' }),

    profileImageId: z.string().nullish(),

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