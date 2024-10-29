import AppForm from "@/components/forms/app-form"
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
    dueDate: new Date().toISOString(),
}

export type bookIssueFormSchemaType = z.infer<typeof bookIssueFormSchema>;

export default function BookIssueForm({ setIsOpen, studentId }: Props) {
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
                <AppForm.Text<bookIssueFormSchemaType>
                    name="bookId"
                    label="Name"
                    placeholder={`e.g. Book ID`}
                    required
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