import { TStudentTransaction } from "@/apps/admin/types/library-book.type";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { useState } from "react";
import BookIssueForm from "./book-issue-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Book, LoaderCircle, RotateCcw } from "lucide-react";
import BookRenewForm from "./book-renew-form";
import { differenceInDays, startOfDay } from "date-fns";

type Props = {
    selectedTransactions: TStudentTransaction[];
    resetSelectedTransactions: () => void;
    teacherId?: string | undefined;
    studentId?: string | undefined;
}

export default function LibraryBooksActionButtons({ resetSelectedTransactions, selectedTransactions, studentId, teacherId }: Props) {
    const [isIssueOpen, setIsIssueOpen] = useState(false);
    const [isRenewOpen, setIsRenewOpen] = useState(false);

    const { mutateAsync: returnBook, isPending: isReturnPending } = useAppMutation();

    const handleReturn = async () => {
        if (!selectedTransactions.length) return;

        const response = await returnBook({
            method: "patch",
            endpoint: QueryKey.BOOK_TRANSACTIONS + '/return',
            data: {
                transactionIds: selectedTransactions?.map(t => t.id),
            },
            invalidateTags: [QueryKey.BOOK_TRANSACTIONS],
        })

        if (response?.status === 200) {
            resetSelectedTransactions();
        }
    }

    return (
        <div className="flex flex-col @2xl:flex-row gap-2 mb-6">
            <ResponsiveDialog
                isOpen={isIssueOpen}
                setIsOpen={setIsIssueOpen}
                title="Issue Book"
            >
                {
                    studentId
                        ? <BookIssueForm setIsOpen={setIsIssueOpen} studentId={studentId} />
                        : teacherId
                            ? <BookIssueForm setIsOpen={setIsIssueOpen} teacherId={teacherId} />
                            : null
                }
            </ResponsiveDialog>

            <Button className='grow' size="lg" onClick={() => setIsIssueOpen(true)}>
                <Book /> New Issue
            </Button>

            <ResponsiveDialog
                isOpen={isRenewOpen}
                setIsOpen={setIsRenewOpen}
                title="New Renewal"
            >
                <BookRenewForm setIsOpen={setIsRenewOpen} resetSelectedTransactions={resetSelectedTransactions} selectedTransactions={selectedTransactions} />
            </ResponsiveDialog>

            <Button
                className='grow'
                variant="outline"
                size="lg"
                onClick={() => setIsRenewOpen(true)}
                disabled={
                    !selectedTransactions.length
                    || selectedTransactions.some(t => differenceInDays(startOfDay(new Date()), startOfDay(new Date(t.dueDate))) > 0)
                }
            >
                <RotateCcw /> Renew
            </Button>

            <Button className='grow' variant="outline" size="lg" onClick={handleReturn} disabled={isReturnPending || !selectedTransactions.length}>
                {
                    isReturnPending ? <>
                        <LoaderCircle className="animate-spin" /> Returning...
                    </> : <>
                        <ArrowLeft /> Return
                    </>
                }
            </Button>
        </div>
    )
}