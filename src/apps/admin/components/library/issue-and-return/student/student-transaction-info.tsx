import { useCustomSearchParams } from "@/hooks/useCustomSearchParams"
import { useGetLibraryStudent } from "../../../students-management/student-actions"
import Library_StudentBasicInfo from "./student-basic-info"
import { useState } from "react"
import { TStudentTransaction } from "@/apps/admin/types/library-book.type"
import BookTransactionTables from "../book-transaction-table"

export default function Library_StudentTransactionInfo() {
    const { searchParams } = useCustomSearchParams();
    const studentId = searchParams.get('studentId');

    const [selectedTransactions, setSelectedTransactions] = useState<TStudentTransaction[]>([]); // used to keep track of selected current issues in side table

    const { data, isLoading } = useGetLibraryStudent({
        id: studentId!,
        options: {
            enabled: !!studentId,
        }
    })

    if (!studentId) return <div className="h-[400px] grid place-items-center text-muted-foreground">Enter student ID to view transactions</div>

    if (isLoading) return <div>Loading...</div>;

    if (!!studentId && !isLoading && !data) return <div className="h-[400px] grid place-items-center text-muted-foreground">No data found.</div>

    return (
        <div className="grid grid-cols-1 @7xl:grid-cols-3 @7xl:gap-x-6 gap-y-6 mt-6">
            <Library_StudentBasicInfo resetSelectedTransactions={() => setSelectedTransactions([])} student={data} selectedTransactions={selectedTransactions} />
            <div className="col-span-2">
                <BookTransactionTables
                    selectedTransactions={selectedTransactions}
                    setSelectedTransactions={setSelectedTransactions}
                />
            </div>
        </div>
    )
}