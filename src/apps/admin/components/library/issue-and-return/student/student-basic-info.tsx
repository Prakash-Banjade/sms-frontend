import { ProfileAvatar } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams'
import { TLibraryStudent } from '@/apps/admin/types/student.type'
import { getImageUrl } from '@/lib/utils'
import { TStudentTransaction } from '@/apps/admin/types/library-book.type'
import LibraryBooksActionButtons from '../books-action-buttons'

type Props = {
    student: TLibraryStudent | undefined;
    selectedTransactions: TStudentTransaction[];
    resetSelectedTransactions: () => void;
}

export default function Library_StudentBasicInfo({ student, selectedTransactions, resetSelectedTransactions }: Props) {
    const { searchParams } = useCustomSearchParams()

    if (!student) return null;

    return (
        <Card className="md:col-span-1 @container">
            <CardContent className="p-6">
                <div className="flex flex-col items-center mb-6">
                    <ProfileAvatar
                        name={student.name}
                        className="w-24 h-24 rounded-full"
                        src={getImageUrl(student.profileImageUrl, 'w=100')}
                        style={{
                            boxShadow: `
                            0 0 0 3px hsl(var(--card)),   
                            0 0 0 5px hsl(var(--primary)) 
                            `,
                        }}
                    />
                    <h2 className="text-xl font-semibold mt-4 capitalize">{student.name}</h2>
                    <div className='text-sm space-x-6 mt-1'>
                        <span>Roll No.: {student.rollNo}</span>
                        <span>Student ID: {searchParams.get('studentId')}</span>
                    </div>
                </div>

                <LibraryBooksActionButtons
                    resetSelectedTransactions={resetSelectedTransactions}
                    selectedTransactions={selectedTransactions}
                    studentId={student.id}
                />

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