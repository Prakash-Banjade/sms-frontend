import { ProfileAvatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ResponsiveDialog } from '@/components/ui/responsive-dialog'
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams'
import { TLibraryStudent } from '@/types/student.type'
import { ArrowLeft, Book, LoaderCircle, RotateCcw } from 'lucide-react'
import BookIssueForm from './book-issue-form'
import { useState } from 'react'
import { useAppMutation } from '@/hooks/useAppMutation'
import { QueryKey } from '@/react-query/queryKeys'
import BookRenewForm from './book-renew-form'
import { getImageUrl } from '@/lib/utils'

type Props = {
    student: TLibraryStudent | undefined;
    selectedTransactions: string[];
    resetSelectedTransactions: () => void;
}

export default function Library_StudentBasicInfo({ student, selectedTransactions, resetSelectedTransactions }: Props) {
    const { searchParams } = useCustomSearchParams()
    const [isIssueOpen, setIsIssueOpen] = useState(false);
    const [isRenewOpen, setIsRenewOpen] = useState(false);

    const { mutateAsync: returnBook, isPending: isReturnPending } = useAppMutation();

    const handleReturn = async () => {
        if (!selectedTransactions.length) return;

        const response = await returnBook({
            method: "patch",
            endpoint: QueryKey.BOOK_TRANSACTIONS + '/return',
            data: {
                transactionIds: selectedTransactions,
            },
            invalidateTags: [QueryKey.BOOK_TRANSACTIONS],
        })

        if (response?.status === 200) {
            resetSelectedTransactions();
        }
    }

    if (!student) return null;

    return (
        <Card className="md:col-span-1 @container">
            <CardContent className="p-6">
                <div className="flex flex-col items-center mb-6">
                    <ProfileAvatar name={student.name} className="w-24 h-24 rounded-full" src={getImageUrl(student.profileImageUrl, 'w=100')} />
                    <h2 className="text-xl font-semibold mt-4">{student.name}</h2>
                    <div className='text-sm space-x-6 mt-1'>
                        <span>Roll No.: {student.rollNo}</span>
                        <span>Student ID: {searchParams.get('studentID')}</span>
                    </div>
                </div>

                <div className="flex flex-col @2xl:flex-row gap-2 mb-6">
                    <ResponsiveDialog
                        isOpen={isIssueOpen}
                        setIsOpen={setIsIssueOpen}
                        title="Issue Book"
                    >
                        <BookIssueForm setIsOpen={setIsIssueOpen} studentId={student.id} />
                    </ResponsiveDialog>

                    <Button className='grow' size="lg" onClick={() => setIsIssueOpen(true)}>
                        <Book /> New Issue
                    </Button>

                    <ResponsiveDialog
                        isOpen={isRenewOpen}
                        setIsOpen={setIsRenewOpen}
                        title="New Renewal"
                    >
                        <BookRenewForm setIsOpen={setIsRenewOpen} resetSelectedTransactions={resetSelectedTransactions} transactionIds={selectedTransactions} />
                    </ResponsiveDialog>

                    <Button className='grow' variant="outline" size="lg" onClick={() => setIsRenewOpen(true)} disabled={!selectedTransactions.length}>
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

                <div className="space-y-2">
                    <h3 className="font-semibold text-lg">About</h3>
                    <div className="text-sm space-y-1">
                        <p className="flex justify-between">
                            <span className="font-medium">Class / Section:</span>
                            <span>{student.classRoomName}</span>
                        </p>
                        <p className="flex justify-between">
                            <span className="font-medium">Contact:</span>
                            <span>{student.phone}</span>
                        </p>
                        <p className="flex justify-between">
                            <span className="font-medium">Email:</span>
                            <span>{student.email}</span>
                        </p>
                        <p className="flex justify-between">
                            <span className="font-medium">Transactions:</span>
                            <span>{student.transactionCount}</span>
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}