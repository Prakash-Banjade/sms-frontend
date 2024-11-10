import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TLibraryBookTransaction } from '@/types/library-book.type'
import { formatDate } from '@/utils/format-date'
import { differenceInDays } from 'date-fns'
import { Calendar, Clock } from 'lucide-react'


type Props = {
    transaction: TLibraryBookTransaction
}

const LibraryCard = ({ transaction }: Props) => {
    const isOverDue = differenceInDays(new Date(transaction.dueDate), new Date()) < 0 && !transaction.returnedAt;
    return (
        <Card key={transaction.id} className="flex flex-col h-full">
            <CardHeader className="pb-2 flex  flex-row justify-between">
                <div className="flex items-center space-x-4">
                    <CardTitle className="text-lg text-wrap">{transaction.bookName} </CardTitle>
                </div>
                <Badge variant={isOverDue ? 'destructiveOutline' : transaction.returnedAt ? 'success' : 'info'} className="text-sm h-fit">
                    {isOverDue ? 'Overdue' : transaction.returnedAt ? 'Returned' : 'Issued'}
                </Badge>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="space-y-2">
                    <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Borrowed : {formatDate({ date: new Date(transaction.createdAt) })}</span>
                    </div>
                    <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Due : {formatDate({ date: new Date(transaction.dueDate) })}</span>
                    </div>

                </div>
            </CardContent>
        </Card>
    )
}

export default LibraryCard
