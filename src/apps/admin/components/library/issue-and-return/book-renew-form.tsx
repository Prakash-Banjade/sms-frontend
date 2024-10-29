import AppForm from "@/components/forms/app-form"
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"

type Props = {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    resetSelectedTransactions: () => void;
    transactionIds: string[];
}

const bookRenewFormSchema = z.object({
    transactionIds: z.array(z.string()).min(1, { message: "At least one transaction is required" }),
    dueDate: z.string({ required_error: "Due date is required" }).refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid due date',
    }),
})

const defaultValues: Partial<bookRenewFormSchemaType> = {
    transactionIds: undefined,
    dueDate: new Date().toISOString(),
}

export type bookRenewFormSchemaType = z.infer<typeof bookRenewFormSchema>;

export default function BookRenewForm({ setIsOpen, transactionIds, resetSelectedTransactions }: Props) {
    const form = useForm<bookRenewFormSchemaType>({
        resolver: zodResolver(bookRenewFormSchema),
        defaultValues: {
            ...defaultValues,
            transactionIds,
        },
    })

    const { mutateAsync } = useAppMutation<Partial<bookRenewFormSchemaType>, any>();

    async function onSubmit(values: bookRenewFormSchemaType) {
        if (!values.transactionIds.length) return;

        const response = await mutateAsync({
            method: "patch",
            endpoint: QueryKey.BOOK_TRANSACTIONS + '/renew',
            data: values,
            invalidateTags: [QueryKey.BOOK_TRANSACTIONS],
        });

        if (response?.data?.message) {
            onDialogClose();
        }
    }

    const onDialogClose = () => {
        resetSelectedTransactions();
        form.reset();
        setIsOpen(false);
    }

    return (
        <AppForm schema={bookRenewFormSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <AppForm.DatePicker<bookRenewFormSchemaType>
                    containerClassName="grow"
                    name="dueDate"
                    label="Due Date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                />
                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel action={onDialogClose}>Cancel</AppForm.Cancel>
                    <AppForm.Submit>Renew</AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}