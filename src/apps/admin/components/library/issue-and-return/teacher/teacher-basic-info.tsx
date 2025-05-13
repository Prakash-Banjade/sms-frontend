import { ProfileAvatar } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams'
import { getImageUrl } from '@/lib/utils'
import { TStudentTransaction } from '@/apps/admin/types/library-book.type'
import { TLibraryTeacher } from '@/apps/admin/types/teacher.type'
import LibraryBooksActionButtons from '../books-action-buttons'

type Props = {
    teacher: TLibraryTeacher | undefined;
    selectedTransactions: TStudentTransaction[];
    resetSelectedTransactions: () => void;
}

export default function Library_TeacherBasicInfo({ teacher, selectedTransactions, resetSelectedTransactions }: Props) {
    const { searchParams } = useCustomSearchParams()

    if (!teacher) return null;

    return (
        <Card className="md:col-span-1 @container">
            <CardContent className="p-6">
                <div className="flex flex-col items-center mb-6">
                    <ProfileAvatar
                        name={teacher.name}
                        className="w-24 h-24 rounded-full"
                        src={getImageUrl(teacher.profileImageUrl, 'w=100')}
                        style={{
                            boxShadow: `
                            0 0 0 3px hsl(var(--card)),   
                            0 0 0 5px hsl(var(--primary)) 
                            `,
                        }}
                    />
                    <h2 className="text-xl font-semibold mt-4 capitalize">{teacher.name}</h2>
                    <div className='text-sm space-x-6 mt-1'>
                        <span>Teacher ID: {searchParams.get('teacherId')}</span>
                    </div>
                </div>

                <LibraryBooksActionButtons
                    resetSelectedTransactions={resetSelectedTransactions}
                    selectedTransactions={selectedTransactions}
                    teacherId={teacher.id}
                />

                <div className="space-y-2">
                    <h3 className="font-semibold text-lg">About</h3>
                    <div className="text-sm space-y-1">
                        <p className="flex justify-between">
                            <span className="font-medium">Departments:</span>
                            <span>
                                {
                                    Array.isArray(teacher.faculties)
                                        ? (teacher.faculties as any).map((f: string) => f).join(', ')
                                        : JSON.parse(teacher.faculties).map((f: string) => f).join(', ')
                                }
                            </span>
                        </p>
                        <p className="flex justify-between">
                            <span className="font-medium">Contact:</span>
                            <span>{teacher.phone}</span>
                        </p>
                        <p className="flex justify-between">
                            <span className="font-medium">Email:</span>
                            <span>{teacher.email}</span>
                        </p>
                        <p className="flex justify-between">
                            <span className="font-medium">Transactions:</span>
                            <span>{teacher.transactionCount}</span>
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}