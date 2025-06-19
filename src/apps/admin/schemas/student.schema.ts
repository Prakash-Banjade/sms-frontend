import { EMAIL_REGEX, NAME_REGEX, NAME_WITH_SPACE_REGEX, PHONE_NUMBER_REGEX } from '@/CONSTANTS';
import { EBloodGroup, EGuardianRelation, EReligion, Gender } from '@/types/global.type';
import { subYears } from 'date-fns';
import { z } from 'zod';

const guardianSchema = z.object({
    id: z.string().uuid({ message: 'Invalid ID' }).optional(), // this is used to perform cascading in through student table in backend
    firstName: z.string().min(1, { message: 'First name is required' }).regex(NAME_REGEX, { message: 'First name can only contain alphabets' }).max(20, { message: 'First name seems too long. Max 20 characters.' }),
    lastName: z.string().min(1, { message: 'Last name is required' }).regex(NAME_WITH_SPACE_REGEX, { message: 'Seems like last name is invalid' }).max(50, { message: 'Last name seems too long. Max 50 characters.' }),
    phone: z.string().regex(PHONE_NUMBER_REGEX, { message: 'Enter a valid phone number' }),
    relation: z.nativeEnum(EGuardianRelation, { message: 'Relation is required' }),
    email: z.string().refine(val => (!!val && EMAIL_REGEX.test(val)) || !val, { message: 'Invalid email' }).nullish(), // optional email field should be treated like this
    address: z.string().min(1, { message: 'Address is required' }).max(80, { message: 'Address seems too long. Max 80 characters.' }).optional(),
    occupation: z.string().min(1, { message: 'Occupation is required' }),
    profileImageId: z.string().nullish(),
    receiveNotification: z.boolean().optional(),
});

export const studentSchema = z.object({
    // ACADEMIC INFORMATION
    classRoomId: z.string().uuid({ message: 'Invalid class room' }),
    sectionId: z.string()
        .transform((val) => (val === '' ? undefined : val))
        .refine((val) => val === undefined || z.string().uuid().safeParse(val).success, {
            message: 'Invalid section ID',
        })
        .nullish(),
    admissionDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid admission date',
    }).optional(),
    dormitoryRoomId: z.string()
        .transform((val) => (val === '' ? undefined : val))
        .refine((val) => val === undefined || z.string().uuid().safeParse(val).success, {
            message: 'Invalid dormitory room ID',
        })
        .nullish(),
    routeStopId: z.string()
        .transform((val) => (val === '' ? undefined : val))
        .refine((val) => val === undefined || z.string().uuid().safeParse(val).success, {
            message: 'Invalid route stop ID',
        })
        .nullish(),

    // PERSONAL INFORMATION
    firstName: z.string().min(1, { message: 'First name is required' }).regex(NAME_REGEX, { message: 'First name can only contain alphabets' }).max(20, { message: 'First name seems too long. Max 20 characters.' }),
    lastName: z.string().min(1, { message: 'Last name is required' }).regex(NAME_WITH_SPACE_REGEX, { message: 'Seems like last name is invalid' }).max(50, { message: 'Last name seems too long. Max 50 characters.' }),
    gender: z.nativeEnum(Gender, { errorMap: () => ({ message: 'Invalid gender' }) }),
    dob: z.string()
        .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date of birth' })
        .refine((val) => new Date(val) <= subYears(new Date(), 2), { message: 'Student must be at least 2 years old' })
        .refine((val) => new Date(val) >= subYears(new Date(), 80), { message: 'Student must be less than 80 years old' }),
    religion: z.nativeEnum(EReligion),
    caste: z.string().nullish(),
    profileImageId: z.string().nullish(),
    isPhysicallyChallenged: z.boolean().default(false).optional(),
    guardians: z.array(guardianSchema).min(1, { message: 'At least one guardian is required' }).max(3, { message: 'Maximum of 3 guardians allowed' }),

    // CONTACT INFORMATION
    email: z.string().email({ message: 'Invalid email address' }),
    phone: z.string().regex(PHONE_NUMBER_REGEX, { message: 'Enter a valid phone number' }),

    // MEDICAL INFORMATION
    bloodGroup: z.nativeEnum(EBloodGroup).optional(),

    // ADDRESS INFORMATION
    currentAddress: z.string().min(1, { message: "Address is required" }).max(80, { message: "Address seems too long. Max 80 characters." }),
    permanentAddress: z.string().min(1, { message: "Address is required" }).max(80, { message: "Address seems too long. Max 80 characters." }),

    // DOCUMENT INFORMATION
    nationalIdCardNo: z.string().nullish(),
    birthCertificateNumber: z.string().nullish(),
    documentAttachmentIds: z.array(z.string()).max(5, { message: "Max 5 files" }).optional(), // values can be URLs or UUIDs

    // BANK INFORMATION
    bankName: z.string().max(80, { message: "Bank name is too long. Max 80 characters." }).optional(),
    bankAccountName: z.string().max(80, { message: "Account name is too long. Max 80 characters." }).optional(),
    bankAccountNumber: z.string().max(80, { message: "Account number is too long. Max 80 characters." }).optional(),

    // PREVIOUS SCHOOL INFORMATION
    previousSchoolName: z.string().max(80, { message: "School name is too long. Max 80 characters." }).nullish(),
    previousSchoolDetails: z.string().max(500, { message: "Note is too long. Max 500 characters." }).nullish(),
})
export type studentSchemaType = z.infer<typeof studentSchema>;

export const createStudentSchema = studentSchema.superRefine((data, ctx) => {
    // Validate bank information: if any of the fields are provided, all must be provided
    const { bankName, bankAccountNumber, bankAccountName } = data;
    if ((bankName || bankAccountNumber || bankAccountName) && (!bankName || !bankAccountNumber || !bankAccountName)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Bank name, account number, and IFSC code are all required if any are provided',
            path: !bankName ? ['bankName'] : !bankAccountNumber ? ['bankAccountNumber'] : ['bankAccountName'],
        });
    }
});

export const guardianFormFieldsDefaultValues: studentSchemaType["guardians"][0] = {
    id: undefined,
    firstName: "",
    lastName: "",
    phone: "",
    relation: EGuardianRelation.GUARDIAN,
    email: undefined,
    address: "",
    occupation: "",
    profileImageId: undefined,
    receiveNotification: false,
}

export const studentFormDefaultValues: Partial<studentSchemaType> = {
    // ACADEMIC INFORMATION
    classRoomId: undefined,
    sectionId: undefined,
    admissionDate: new Date().toISOString(),
    dormitoryRoomId: undefined,

    // PERSONAL INFORMATION
    firstName: "",
    lastName: "",
    gender: undefined,
    dob: new Date().toISOString(),
    religion: undefined,
    caste: "",
    profileImageId: undefined,
    isPhysicallyChallenged: false,
    guardians: [
        guardianFormFieldsDefaultValues
    ],

    // CONTACT INFORMATION
    email: "",
    phone: "",

    // MEDICAL INFORMATION
    bloodGroup: undefined,

    // ADDRESS INFORMATION
    currentAddress: "",
    permanentAddress: "",

    // DOCUMENT INFORMATION
    nationalIdCardNo: "",
    birthCertificateNumber: "",
    documentAttachmentIds: [],

    // BANK INFORMATION
    bankName: "",
    bankAccountNumber: "",
    bankAccountName: "",

    // PREVIOUS SCHOOL INFORMATION
    previousSchoolName: "",
    previousSchoolDetails: ""
}
