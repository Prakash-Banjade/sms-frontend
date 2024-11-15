import { EBookTransactionStatus } from "@/types/global.type"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { useGetStudentTransactions } from "../actions";
import { createQueryString } from "@/utils/create-query-string";
import { formatDate } from "@/utils/format-date";
import { differenceInDays } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
    selectedTransactions: string[];
    setSelectedTransactions: React.Dispatch<React.SetStateAction<string[]>>;
}

export function Library_CurrentIssueTable({ selectedTransactions, setSelectedTransactions }: Props) {
    const { searchParams } = useCustomSearchParams()

    const { data, isLoading } = useGetStudentTransactions({
        queryString: createQueryString({
            status: EBookTransactionStatus.Issued,
            skipPagination: true,
            studentId: searchParams.get('studentID'),
        }),
    });

    const handleCheckboxChange = (bookId: string) => {
        setSelectedTransactions(prev =>
            prev.includes(bookId)
                ? prev.filter(id => id !== bookId)
                : [...prev, bookId]
        )
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked && data?.data?.length) {
            setSelectedTransactions(data.data.map(transaction => transaction.id))
        } else {
            setSelectedTransactions([])
        }
    }

    if (isLoading) return <div>Loading...</div>;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px]">
                        <Checkbox
                            checked={!!data?.data.length && (selectedTransactions.length === data.data.length)}
                            onCheckedChange={handleSelectAll}
                            aria-label="Select all"
                        />
                    </TableHead>
                    <TableHead>Book Code</TableHead>
                    <TableHead>Book Name</TableHead>
                    <TableHead>Issued Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Issue Days</TableHead>
                    <TableHead>Fine</TableHead>
                    <TableHead>Renewals</TableHead>
                    <TableHead>Last Renewal</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data?.data?.map((transaction) => {
                    const renewals = transaction.renewals?.split(',').filter(renewal => renewal !== '');
                    
                    return (
                        <TableRow key={transaction.id}>
                            <TableCell>
                                <Checkbox
                                    checked={selectedTransactions.includes(transaction.id)}
                                    onCheckedChange={() => handleCheckboxChange(transaction.id)}
                                    aria-label={`Select ${transaction.bookName}`}
                                />
                            </TableCell>
                            <TableCell>{transaction.bookCode}</TableCell>
                            <TableCell>{transaction.bookName}</TableCell>
                            <TableCell>{formatDate({ date: new Date(transaction.createdAt) })}</TableCell>
                            <TableCell>{formatDate({ date: new Date(transaction.dueDate) })}</TableCell>
                            <TableCell>{Math.abs(differenceInDays(new Date(transaction.createdAt), new Date()))} days</TableCell>
                            <TableCell>-</TableCell>
                            <TableCell>{renewals?.length}</TableCell>
                            <TableCell>
                                {
                                    renewals?.length
                                        ? formatDate({ date: new Date(renewals[renewals.length - 1]) })
                                        : '-'
                                }
                                </TableCell>
                        </TableRow>
                    )
                })}
                {
                    data?.data?.length === 0 && <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                            No results found.
                        </TableCell>
                    </TableRow>
                }
            </TableBody>
        </Table>
    )
}