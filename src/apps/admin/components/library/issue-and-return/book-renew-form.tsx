import AppForm from "@/components/forms/app-form"
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { TStudentTransaction } from "@/types/library-book.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { differenceInDays, startOfDay } from "date-fns";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod"

type Props = {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    resetSelectedTransactions: () => void;
    selectedTransactions: TStudentTransaction[];
}

const bookRenewFormSchema = z.object({
    transactionIds: z.array(z.string()).min(1, { message: "At least one transaction is required" }),
    dueDate: z.string({ required_error: "Due date is required" }).refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid due date',
    }).refine((val) => new Date(val) > new Date(), {
        message: 'Due date must be after today',
    })
})

const defaultValues: Partial<bookRenewFormSchemaType> = {
    dueDate: new Date().toISOString(),
}

export type bookRenewFormSchemaType = z.infer<typeof bookRenewFormSchema>;

export default function BookRenewForm({ setIsOpen, selectedTransactions, resetSelectedTransactions }: Props) {
    const form = useForm<bookRenewFormSchemaType>({
        resolver: zodResolver(bookRenewFormSchema),
        defaultValues: {
            ...defaultValues,
            transactionIds: selectedTransactions?.map(t => t.id),
        },
    })

    const { mutateAsync } = useAppMutation<Partial<bookRenewFormSchemaType>, any>();

    async function onSubmit(values: bookRenewFormSchemaType) {
        if (!values.transactionIds.length) return;
        // check if any transaction is overdue, if yes don't allow
        const overdueTransactions = selectedTransactions?.filter(t => differenceInDays(startOfDay(new Date()), startOfDay(new Date(t.dueDate))) > 0);
        if (overdueTransactions?.length) {
            toast.error(`Cannot renew overdue transactions: ${overdueTransactions.map(t => t.bookName).join(', ')}`);
            return;
        }

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