import { PHONE_NUMBER_REGEX } from '@/CONSTANTS';
import { EBloodGroup, EReligion, Gender } from '@/types/global.type';
import { z } from 'zod';

const GuardianSchema = z.object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    phone: z.string().regex(PHONE_NUMBER_REGEX, { message: 'Enter a valid phone number' }),
    email: z.string().email({ message: 'Invalid email' }).nullish(),
    address: z.string().nullish(),
    occupation: z.string().min(1, { message: 'Occupation is required' }),
    profileImageId: z.string().uuid({ message: 'Invalid image ID or URL' }).nullish(),
});

const CreateStudentSchema = z.object({
    // ACADEMIC INFORMATION
    classRoomId: z.string().uuid({ message: 'Invalid class room ID' }),
    rollNo: z.coerce.number({ required_error: 'Roll number is required' }),
    admissionDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid admission date',
    }),
    feeDiscountPercentage: z.coerce.number().min(0).max(100).optional(),
    admissionDiscountPercentage: z.coerce.number().min(0).max(100).optional(),
    dormitoryRoomId: z.string().uuid({ message: 'Invalid dormitory room ID' }).optional(),

    // PERSONAL INFORMATION
    firstName: z.string().min(1, { message: 'First name is required' }).regex(/^[A-Za-z]+$/, { message: 'First name can only contain alphabets' }),
    lastName: z.string().min(1, { message: 'Last name is required' }).regex(/^[A-Za-z]+$/, { message: 'Last name can only contain alphabets' }),
    gender: z.nativeEnum(Gender, { errorMap: () => ({ message: 'Invalid gender' }) }),
    dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date of birth',
    }),
    religion: z.nativeEnum(EReligion).nullish(),
    caste: z.string().nullish(),
    profileImageId: z.string().uuid({ message: 'Invalid profile image ID or URL' }).nullish(),

    guardians: z.array(GuardianSchema).min(1, { message: 'At least one guardian is required' }),

    // CONTACT INFORMATION
    email: z.string().email({ message: 'Invalid email address' }),
    phone: z.string().regex(PHONE_NUMBER_REGEX, { message: 'Enter a valid phone number' }),

    // MEDICAL INFORMATION
    bloodGroup: z.nativeEnum(EBloodGroup).optional(),

    // ADDRESS INFORMATION
    currentAddress: z.string().optional(),
    permanentAddress: z.string().optional(),

    // DOCUMENT INFORMATION
    nationalIdCardNo: z.string().nullish(),
    birthCertificateNumber: z.string().nullish(),
    additionalNotes: z.string().nullish(),
    documentAttatchmentIds: z.array(z.string()).optional(),

    // BANK INFORMATION
    bankName: z.string().nullish(),
    bankAccountNumber: z.string().nullish(),
    ifscCode: z.string().nullish(),

    // PREVIOUS SCHOOL INFORMATION
    previousSchoolDetails: z.string().nullish(),
})
    .superRefine((data, ctx) => {
        // Validate bank information: if any of the fields are provided, all must be provided
        const { bankName, bankAccountNumber, ifscCode } = data;
        if ((bankName || bankAccountNumber || ifscCode) && (!bankName || !bankAccountNumber || !ifscCode)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Bank name, account number, and IFSC code are all required if any are provided',
                path: ['bankInformation'], // you can assign this to a meaningful path
            });
        }
    });

export { CreateStudentSchema };
