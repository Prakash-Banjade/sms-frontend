import AppForm from "@/components/forms/app-form"
import { useAppMutation } from "@/hooks/useAppMutation";
import { startOfDayString } from "@/lib/utils";
import { QueryKey } from "@/react-query/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod"

type Props = {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    studentId: string;
}

const bookIssueFormSchema = z.object({
    bookId: z.string({ required_error: "Book ID is required" }).uuid(),
    dueDate: z.string({ required_error: "Due date is required" }).refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid due date',
    }),
    studentId: z.string({ required_error: "Student ID is required" }).uuid(),
})

const defaultValues: Partial<bookIssueFormSchemaType> = {
    bookId: undefined,
    dueDate: startOfDayString(new Date()),
}

export type bookIssueFormSchemaType = z.infer<typeof bookIssueFormSchema>;

export default function BookIssueForm({ setIsOpen, studentId }: Props) {
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();

    const form = useForm<bookIssueFormSchemaType>({
        resolver: zodResolver(bookIssueFormSchema),
        defaultValues: {
            ...defaultValues,
            studentId,
        },
    })

    const { mutateAsync } = useAppMutation<Partial<bookIssueFormSchemaType>, any>();

    async function onSubmit(values: bookIssueFormSchemaType) {
        const response = await mutateAsync({
            method: "post",
            endpoint: QueryKey.BOOK_TRANSACTIONS,
            data: values,
            invalidateTags: [QueryKey.BOOK_TRANSACTIONS],
            toastOnSuccess: false,
        });

        if (response?.data?.message) {
            queryClient.invalidateQueries({ queryKey: [QueryKey.STUDENTS, QueryKey.LIBRARY, searchParams.get('studentID')] })
            onDialogClose();
        }
    }

    const onDialogClose = () => {
        form.reset();
        setIsOpen(false);
    }

    return (
        <AppForm schema={bookIssueFormSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <AppForm.DynamicCombobox<bookIssueFormSchemaType>
                    name='bookId'
                    label='Book'
                    placeholder='Select book'
                    description='Select a book from the list'
                    queryKey={QueryKey.LIBRARY_BOOKS}
                />

                <AppForm.DatePicker<bookIssueFormSchemaType>
                    containerClassName="grow"
                    name="dueDate"
                    label="Due Date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                />
                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel action={onDialogClose}>Cancel</AppForm.Cancel>
                    <AppForm.Submit>Submit</AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}