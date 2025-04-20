import { useCustomSearchParams } from "@/hooks/useCustomSearchParams"
import { useGetLibraryStudent } from "../../students-management/student-actions"
import Library_StudentBasicInfo from "./student-basic-info"
import Library_StudentTransactionTable from "./student-transaction-table"
import { useState } from "react"
import { TStudentTransaction } from "@/apps/admin/types/library-book.type"

export default function Library_StudentTransactionInfo() {
    const { searchParams } = useCustomSearchParams();
    const [selectedTransactions, setSelectedTransactions] = useState<TStudentTransaction[]>([]); // used to keep track of selected current issues in side table

    const { data, isLoading } = useGetLibraryStudent({
        id: searchParams.get('studentID')!,
        options: {
            enabled: !!searchParams.get('studentID'),
        }
    })

    if (!searchParams.get('studentID')) return <div className="h-[400px] grid place-items-center text-muted-foreground">Enter student ID to view transactions</div>

    if (isLoading) return <div>Loading...</div>;

    if (!!searchParams.get('studentID') && !isLoading && !data) return <div className="h-[400px] grid place-items-center text-muted-foreground">No data found.</div>

    return (
        <div className="grid grid-cols-1 @7xl:grid-cols-3 @7xl:gap-x-6 gap-y-6 mt-6"> 
            <Library_StudentBasicInfo resetSelectedTransactions={() => setSelectedTransactions([])} student={data} selectedTransactions={selectedTransactions} />
            <div className="col-span-2">
                <Library_StudentTransactionTable selectedTransactions={selectedTransactions} setSelectedTransactions={setSelectedTransactions} />
            </div>
        </div>
    )
}