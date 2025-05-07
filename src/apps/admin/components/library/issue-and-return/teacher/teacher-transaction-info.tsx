import { useCustomSearchParams } from "@/hooks/useCustomSearchParams"
import { useState } from "react"
import { TStudentTransaction } from "@/apps/admin/types/library-book.type"
import { useGetLibraryTeacher } from "../../../teachers/actions"
import Library_TeacherBasicInfo from "./teacher-basic-info"
import BookTransactionTables from "../book-transaction-table"

export default function Library_TeacherTransactionInfo() {
    const { searchParams } = useCustomSearchParams();
    const teacherId = searchParams.get('teacherId');

    const [selectedTransactions, setSelectedTransactions] = useState<TStudentTransaction[]>([]); // used to keep track of selected current issues in side table

    const { data, isLoading } = useGetLibraryTeacher({
        id: teacherId!,
        options: {
            enabled: !!teacherId,
        }
    })

    if (!teacherId) return <div className="h-[400px] grid place-items-center text-muted-foreground">Enter teacher ID to view transactions</div>

    if (isLoading) return <div>Loading...</div>;

    if (!!teacherId && !isLoading && !data) return <div className="h-[400px] grid place-items-center text-muted-foreground">No data found.</div>

    return (
        <div className="grid grid-cols-1 @7xl:grid-cols-3 @7xl:gap-x-6 gap-y-6 mt-6">
            <Library_TeacherBasicInfo resetSelectedTransactions={() => setSelectedTransactions([])} teacher={data} selectedTransactions={selectedTransactions} />
            <div className="col-span-2">
                <BookTransactionTables
                    selectedTransactions={selectedTransactions}
                    setSelectedTransactions={setSelectedTransactions}
                />
            </div>
        </div>
    )
}