import { z } from "zod"

export const generalSettingsFormSchema = z.object({
    libraryFine: z.coerce.number().nonnegative({ message: 'Library fine must be a non-negative number' }).optional(),
    currency: z.string().optional(),
})

export type TGeneralSettingsFormType = z.infer<typeof generalSettingsFormSchema>;

export const generalSettingsDefaultValues: Partial<TGeneralSettingsFormType> = {
    libraryFine: 0,
    currency: '',
}