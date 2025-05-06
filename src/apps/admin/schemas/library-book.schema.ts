import { z } from 'zod';

export const libraryBookSchema = z.object({
    bookCode: z
        .string()
        .min(1, { message: 'Book code is required' }),

    bookName: z
        .string()
        .min(1, { message: 'Book name is required' }),

    publisherName: z
        .string()
        .optional(),

    description: z
        .string()
        .nullish(),

    publicationYear: z
        .coerce
        .number()
        .int({ message: 'Publication year must be an integer' })
        .min(new Date().getFullYear() - 100, { message: 'Publication year cannot be older than 100 years' })
        .max(new Date().getFullYear(), { message: 'Publication year cannot be in the future' })
        .refine(val => String(val).length === 4, { message: 'Publication year must be a 4-digit number' }),

    copiesCount: z
        .coerce
        .number()
        .int({ message: 'Copies count must be an integer' })
        .min(1, { message: 'Copies count must be at least 1' }),

    categoryId: z.string({ required_error: 'Category is required' }).uuid({ message: 'Invalid category ID' }),
    documentIds: z.array(z.string()).max(5, { message: "Max 5 files" }).optional(),
    coverImageId: z.string().nullish(),
});

export type libraryBookSchemaType = z.infer<typeof libraryBookSchema>;

export const libraryBookFormDefaultValues: Partial<libraryBookSchemaType> = {
    bookCode: '',
    bookName: '',
    publisherName: '',
    description: '',
    publicationYear: new Date().getFullYear(),
    copiesCount: 1,
    documentIds: [],
    coverImageId: null,
};
